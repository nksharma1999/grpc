#Client Code Generation

protoc -I ./proto \
  --js_out=import_style=commonjs:./generated \
  --grpc-web_out=import_style=commonjs,mode=grpcwebtext:./generated \
  ./proto/random.proto


#Web Client JS file
protoc -I ./proto \
  --js_out=import_style=commonjs:../client/grpc \ 
  --grpc-web_out=import_style=commonjs,mode=grpcwebtext:../client/grpc \     
  ./proto/random.proto


#Web Client TS file
protoc -I=. ./proto/*.proto \
  --js_out=import_style=commonjs:../client/src \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:../client/src


#Server Code 
npx proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=proto/ proto/*.proto