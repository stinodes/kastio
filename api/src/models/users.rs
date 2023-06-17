use crate::schema::users;
use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};

use super::auth::TokenClaims;

#[derive(Debug, Serialize, Deserialize, Queryable, Insertable, Clone)]
#[diesel(table_name = users)]
pub struct UserWithPW {
    pub email: String,
    pub username: String,
    pub password: String,
}

impl UserWithPW {
    pub fn new(email: String, username: String, password: String) -> Self {
        Self {
            email,
            username,
            password,
        }
    }

    pub fn from_data(email: String, username: String, password: String) -> Self {
        Self {
            email,
            username,
            password,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserWithoutPW {
    pub email: String,
    pub username: String,
}

impl UserWithoutPW {
    // pub fn from_user(user: &User) -> Self {
    //     Self {
    //         email: user.email.to_string(),
    //         username: user.username.to_string(),
    //     }
    // }

    pub fn from_token(token: &TokenClaims) -> Self {
        Self {
            email: token.email.to_string(),
            username: token.sub.to_string(),
        }
    }
}
