use actix_cors::Cors;
use actix_web::{get, http::header, web::Data, App, HttpResponse, HttpServer, Responder};
use db::create_db_pool;
use dotenvy::dotenv;
use handlers::authentication::{get_me, login, register};

mod db;
mod handlers;
mod middleware;
mod models;
mod schema;

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    if std::env::var_os("RUST_LOG").is_none() {
        std::env::set_var("RUST_LOG", "actix_web=info");
    }
    env_logger::init();

    log::info!("Starting up!");

    HttpServer::new(move || {
        let db = create_db_pool();
        App::new()
            .wrap(
                Cors::default()
                    .allowed_origin("http://localhost:3000")
                    .allowed_methods(vec!["GET", "POST"])
                    .allowed_headers(vec![
                        header::AUTHORIZATION,
                        header::CONTENT_TYPE,
                        header::ACCEPT,
                        header::ACCEPT_LANGUAGE,
                        header::ACCEPT_ENCODING,
                    ])
                    .expose_headers(vec!["set-cookie"])
                    .supports_credentials()
                    .max_age(3600),
            )
            .service(hello)
            .service(get_me)
            .service(register)
            .service(login)
            .app_data(Data::new(db))
    })
    .bind(("0.0.0.0", 8000))?
    .run()
    .await
}
