use std::future::{ready, Ready};

use actix_web::{error::ErrorUnauthorized, http, FromRequest, HttpMessage};
use jsonwebtoken::{decode, DecodingKey};

use crate::models::{auth::TokenClaims, users::UserWithoutPW};

fn decode_jwt(token: &String) -> Result<TokenClaims, jsonwebtoken::errors::Error> {
    let secret = std::env::var("JWT_SECRET").expect("JWT_SECRET must be set");
    let token = decode::<TokenClaims>(
        &token,
        &DecodingKey::from_secret(secret.as_ref()),
        &jsonwebtoken::Validation::default(),
    )?;
    Ok(token.claims)
}

pub struct AuthMiddleware {
    pub user: UserWithoutPW,
}

impl FromRequest for AuthMiddleware {
    type Error = actix_web::Error;
    type Future = Ready<Result<Self, Self::Error>>;

    fn from_request(req: &actix_web::HttpRequest, _: &mut actix_web::dev::Payload) -> Self::Future {
        let token = req
            .cookie("token")
            .map(|c| c.value().to_string())
            .or_else(|| {
                req.headers()
                    .get(http::header::AUTHORIZATION)
                    .map(|header| header.to_str().unwrap().split_at(7).1.to_string())
            });

        if token.is_none() {
            return ready(Err(ErrorUnauthorized("You are not logged in.")));
        }

        log::info!("Token is set.");

        let claims = match decode_jwt(&token.unwrap()) {
            Ok(c) => c,
            Err(_) => {
                return ready(Err(ErrorUnauthorized("Invalid Token")));
            }
        };

        log::info!("Claims: {} - {}", claims.sub, claims.email);

        let user = UserWithoutPW::from_token(&claims);

        req.extensions_mut().insert::<UserWithoutPW>(user.clone());

        ready(Ok(AuthMiddleware { user }))
    }
}
