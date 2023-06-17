use actix_web::{get, web::Data, App, HttpResponse, HttpServer, Responder};
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
