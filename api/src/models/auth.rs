use chrono::{Duration, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenClaims {
    pub sub: String,
    pub iat: usize,
    pub exp: usize,
    pub email: String,
}

impl TokenClaims {
    pub fn from_user_info(sub: String, email: String) -> Self {
        let now = Utc::now();
        let iat = now.timestamp() as usize;
        let expires_in = std::env::var("JWT_EXPIRES_IN")
            .map(|v| v.parse::<i64>().unwrap())
            .unwrap();
        let exp = (now + Duration::minutes(expires_in)).timestamp() as usize;

        Self {
            sub,
            email,
            iat,
            exp,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginBody {
    pub username: String,
    pub password: String,
}
