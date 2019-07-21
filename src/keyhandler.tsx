//import { app } from "./app";

class KeyHandler {
    onKeyPress(key: string) {
        console.log(key)
    }
}

export const keyHandler = new KeyHandler();