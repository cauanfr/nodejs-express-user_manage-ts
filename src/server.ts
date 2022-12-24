import app from "./app";

const PORT: number = 3000;
const runningMessage: string = `App running on localhost:${PORT}`;

app.listen(PORT, () => console.log(runningMessage));
