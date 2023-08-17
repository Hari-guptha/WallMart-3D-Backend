import { Server } from "socket.io";

const io = new Server({
    cors: {
        origin: "*",
    },
});

io.listen(3002);

const characters = [];

const generateRandomPosition = () => {
    return [Math.random() * 3, 0, Math.random() * 3];
};

io.on("connection", (socket) => {
    console.log("user connected");

    characters.push({
        id: socket.id,
        position: generateRandomPosition(),
        gender: " "
    });
    socket.emit("start");
    io.emit("characters", characters);

    socket.on("gender", (gender) => {
        const character = characters.find(
            (character) => character.id === socket.id
        );

        if (character) {
            character.gender = gender;
            io.emit("characters", characters);
            console.log("gender updated")
        } else {
            console.error(`Character not found for socket ID: ${socket.id}`);
        }
    });

    socket.on("move", (position) => {
        const character = characters.find(
            (character) => character.id === socket.id
        );

        if (character) {
            character.position = position;
            io.emit("characters", characters);
        } else {
            console.error(`Character not found for socket ID: ${socket.id}`);
        }
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");

        const characterIndex = characters.findIndex(
            (character) => character.id === socket.id
        );

        if (characterIndex !== -1) {
            characters.splice(characterIndex, 1);
            io.emit("characters", characters);
            console.log("player logout: " + socket.id);
        }
    });
});
