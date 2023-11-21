// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

#[tauri::command]
fn quit_game() {
    std::process::exit(1);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![quit_game])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
