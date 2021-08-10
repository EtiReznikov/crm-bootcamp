export function emailValidation(email) {
    const validEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email);
    if (validEmail) {
        return 0;
    } else if (email.length === 0) {
        return 1;
    } else if (!validEmail) {
        return 2;
    }
}