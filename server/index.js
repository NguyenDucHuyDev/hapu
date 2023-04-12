import app from "./server.js";

const PORT_SERVER = process.env.PORT || 5050;

app.listen(PORT_SERVER, () => {
	console.log(`Server is running at ${PORT_SERVER}`);
});