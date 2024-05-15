import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./proto/random";
import { RandomHandlers } from "./proto/randomPackage/Random";
//npx proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=proto/ proto/*.proto
const PORT = 8082;
const PROTO_FILE = "./proto/random.proto";

const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_FILE));
const grpcObj = grpc.loadPackageDefinition(
  packageDef
) as unknown as ProtoGrpcType;

const randomPackage = grpcObj.randomPackage;

function main() {
  const server = getServer();

  server.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Your server as started on port ${port}`);
      server.start();
    }
  );
}

function getServer() {
  const server = new grpc.Server();
  server.addService(randomPackage.Random.service, {
    PingPong: handlePingPong,
    RandomNumber: handleRandomNumberStream,
  } as RandomHandlers);

  return server;
}

//REST API like request
const handlePingPong = (req:any, res:any) => {
  console.log(req.request);
  res(null, { message: "Pong" });
};
//Server Stream
const handleRandomNumberStream = (call: any) => {
  const { maxVal = 10 } = call.request;
  console.log(maxVal);
  let runCount = 0;
  const id = setInterval(() => {
    runCount = ++runCount;
    call.write({ num: Math.floor(Math.random() * maxVal) });

    if (runCount >= 10) {
      clearInterval(id);
      call.end();
    }
  }, 500);
};
main();
