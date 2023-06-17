// @generated automatically by Diesel CLI.

diesel::table! {
    users (username) {
        username -> Varchar,
        email -> Varchar,
        password -> Varchar,
    }
}
