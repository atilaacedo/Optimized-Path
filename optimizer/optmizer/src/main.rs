use axum::{routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;

#[derive(Debug, Deserialize)]
struct Stop {
    id: String,
    lat: f64,
    lng: f64,
}

#[derive(Debug, Deserialize)]
struct OptimizeRequest {
    stops: Vec<Stop>,
}

#[derive(Debug, Serialize)]
struct OptimizeResponse {
    #[serde(rename = "orderedIds")]
    ordered_ids: Vec<String>,
}

fn calculate_distance(lat1: f64, lon1: f64, lat2: f64, lon2: f64) -> f64 {
    //raio da terra km
    let r = 6371.0;
    let d_lat = (lat2 - lat1).to_radians();
    let d_lon = (lon2 - lon1).to_radians();

    let a = (d_lat / 2.0).sin().powi(2)
            + lat1.to_radians().cos() * lat2.to_radians().cos() * (d_lon / 2.0).sin().powi(2);
    let c = 2.0 * a.sqrt().atan2((1.0 - a).sqrt());

    r * c
}

async fn optimize_route(Json(payload): Json<OptimizeRequest>) -> Json<OptimizeResponse> {
    let mut stops = payload.stops;
    let mut ordered_ids = Vec::new();

    if stops.is_empty() {
        return Json(OptimizeResponse { ordered_ids });
    }

    let mut current_stop = stops.remove(0);
    ordered_ids.push(current_stop.id.clone());

    while !stops.is_empty() {
        let mut closest_index = 0;
        let mut min_distance = f64::MAX;

        for (i, next_stop) in stops.iter().enumerate() {
            let dist = calculate_distance(current_stop.lat, current_stop.lng, next_stop.lat, next_stop.lng);
            if dist < min_distance {
                min_distance = dist;
                closest_index = i;
            }
        }

        current_stop = stops.remove(closest_index);
        ordered_ids.push(current_stop.id.clone());
    }

    Json(OptimizeResponse { ordered_ids })
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/optimize", post(optimize_route));

    let addr = SocketAddr::from(([127, 0, 0, 1], 3001));
    println!("http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}