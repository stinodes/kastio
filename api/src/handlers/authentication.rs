use actix_web::cookie::time::Duration;
use actix_web::cookie::{Cookie, SameSite};
use actix_web::error::{ErrorBadRequest, ErrorUnauthorized};
use actix_web::web::{self, Data};
use actix_web::{get, post, web::Json, HttpResponse, Responder};
use argon2::password_hash::rand_core::OsRng;
use argon2::password_hash::{errors, SaltString};
use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use diesel::prelude::*;
use diesel::QueryDsl;
use jsonwebtoken::{encode, EncodingKey, Header};
use serde_json::json;

use crate::db::Pool;
use crate::models::auth::{LoginBody, TokenClaims};
use crate::{middleware::auth_middleware::AuthMiddleware, models::users::*};

fn hash_password(input: String) -> Result<String, errors::Error> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    Ok(argon2.hash_password(input.as_bytes(), &salt)?.to_string())
}
fn verify_password(input: String, hash: String) -> Result<(), errors::Error> {
    let argon2 = Argon2::default();
    let parsed_hash = PasswordHash::new(&hash)?;
    argon2.verify_password(input.as_bytes(), &parsed_hash)
}

#[get("/auth/me")]
pub async fn get_me(auth: AuthMiddleware) -> impl Responder {
    let user = auth.user;
    return HttpResponse::Ok().json(user);
}

#[post("/auth/login")]
pub async fn login(
    body: Json<LoginBody>,
    pool: Data<Pool>,
) -> Result<HttpResponse, actix_web::Error> {
    use crate::schema::users::dsl::*;

    let mut db = web::block(move || {
        let conn = pool.get().expect("Could not get connection.");
        conn
    })
    .await?;

    let matched_users = users
        .filter(username.eq(&body.username))
        .select(UserWithPW::as_select())
        .load(&mut db)
        .unwrap_or(vec![]);

    let user = match matched_users.get(0) {
        Some(u) => u,
        None => {
            return Err(ErrorUnauthorized("Invalid credentials."));
        }
    };

    let password_check = verify_password(body.password.to_owned(), user.password.to_owned());

    if password_check.is_err() {
        return Err(ErrorUnauthorized("Incorrect credentials."));
    }

    let claims = TokenClaims::from_user_info(user.username.to_owned(), user.email.to_owned());
    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(std::env::var("JWT_SECRET").unwrap().as_bytes()),
    )
    .unwrap();

    let cookie = Cookie::build("token", token.to_owned())
        .path("/")
        .max_age(Duration::new(60 * 60, 0))
        .same_site(SameSite::None)
        .secure(true)
        .finish();

    return Ok(HttpResponse::Ok()
        .cookie(cookie)
        .json(json!({"status": "success", "token": token})));
}

#[post("/auth/register")]
pub async fn register(
    body: Json<UserWithPW>,
    pool: Data<Pool>,
) -> Result<HttpResponse, actix_web::Error> {
    use crate::schema::users;
    use crate::schema::users::dsl::*;

    let mut db = web::block(move || {
        let conn = pool.get().expect("Could not get connection.");
        conn
    })
    .await?;

    let matching_users = users
        .filter(username.eq(&body.username))
        .load::<UserWithPW>(&mut db);
    let no_duplicate = matching_users.unwrap_or(vec![]).is_empty();

    if !no_duplicate {
        return Ok(HttpResponse::Created().finish());
    }

    let hash = match hash_password(body.password.to_owned()) {
        Ok(h) => h,
        Err(_) => {
            return Err(ErrorBadRequest("Something was wrong with the password."));
        }
    };

    diesel::insert_into(users::table)
        .values(UserWithPW {
            username: body.username.to_string(),
            email: body.email.to_string(),
            password: hash,
        })
        .get_result::<UserWithPW>(&mut db)
        .expect("Error creating user");

    Ok(HttpResponse::Created().finish())
}
