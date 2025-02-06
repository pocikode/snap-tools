use std::fs::create_dir;
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(setup_handler)
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn setup_handler(app: &mut tauri::App) -> Result<(), Box<(dyn std::error::Error + 'static)>> {
    let path = app.path().app_config_dir().map_err(|e| e.to_string())?;
    println!("config dir: {}", path.to_string_lossy());
    if !path.exists() {
        create_dir(&path).map_err(|_| "creating app config directory failed".to_owned())?;
    }

    Ok(())
}
