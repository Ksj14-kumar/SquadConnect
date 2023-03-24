const fs = require("fs")
let Files = {}
module.exports = (server) => {
    const io = require('socket.io')(server, {
        path: "/messenger",
        transports: ["polling", "websocket"],
        cors: {
            origin: process.env.UI_URL,
            allowedHeaders: ["Content-Type", "Accept", "Authorization"],
            allowedMethods: ["GET", "PUT", "POST", "DELETE"],
            credentials: true,
            preflightContinue: true
        },
        cookie: {
            httpOnly: true,
            name: "ck",
            maxAge: 24 * 60 * 60 * 1000
        }
    });
    const chatApp = io.of("/chat")
    console.log(io)
    chatApp.on("connection", (socket) => {
        console.log("a user is connected")
        socket.on("Start", function (data) {
            console.log({ data })
            const Name = data["Name"];
            Files[Name] = {
                FileSize: data["Size"],
                Data: "",
                Downloaded: 0,
            };
            let Place = 0;
            try {
                const Stat = fs.statSync("Temp/" + Name);
                if (Stat.isFile()) {
                    Files[Name]["Downloaded"] = Stat.size;
                    Place = Stat.size / 524288;
                }
            } catch (er) { } //It's a New File 
            fs.open("Temp/" + Name, "a", 0755, function (err, fd) {
                if (err) {
                    console.log(err);
                } else {
                    Files[Name]["Handler"] = fd; //We store the file handler so we can write to it later 
                    socket.emit("MoreData", { Place: Place, Percent: 0 });
                }
            });
        });
        socket.on("Upload", function (data) {
            var Name = data["Name"];
            Files[Name]["Downloaded"] += data["Data"].length;
            Files[Name]["Data"] += data["Data"];
            if (Files[Name]["Downloaded"] == Files[Name]["FileSize"]) {
                //If File is Fully Uploaded 
                fs.write(
                    Files[Name]["Handler"],
                    Files[Name]["Data"],
                    null,
                    "Binary",
                    function (err, Writen) {
                        //Get Thumbnail Here 
                    }
                );
            } else if (Files[Name]["Data"].length > 10485760) {
                //If the Data Buffer reaches 10MB 
                fs.write(
                    Files[Name]["Handler"],
                    Files[Name]["Data"],
                    null,
                    "Binary",
                    function (err, Writen) {
                        Files[Name]["Data"] = ""; //Reset The Buffer 
                        let Place = Files[Name]["Downloaded"] / 524288;
                        let Percent =
                            (Files[Name]["Downloaded"] / Files[Name]["FileSize"]) * 100;
                        socket.emit("MoreData", { Place: Place, Percent: Percent });
                    }
                );
            } else {
                let Place = Files[Name]["Downloaded"] / 524288;
                let Percent = (Files[Name]["Downloaded"] / Files[Name]["FileSize"]) * 100;
                socket.emit("MoreData", { Place: Place, Percent: Percent });
            }
        });
    })
}
// ==========================Socket connection===============================
