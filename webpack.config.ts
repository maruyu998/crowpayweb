import path from "path";
import CopyPlugin from "copy-webpack-plugin";

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    main: "./client/src/index.tsx",
    sw: './client/src/sw.ts'
  },
  output: {
    path: path.join(__dirname, "_dist", "public"),
    filename: "[name].js",
  },
  resolve: {extensions: [".ts", ".tsx", ".js", ".json"]},
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: "babel-loader",
            options: { presets: ["@babel/preset-env", "@babel/react"] },
          },{
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "tsconfig.json"),
            },
          }
        ],
        exclude: [
          "/node_modules/", 
          "/server/"
        ],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
        exclude: [
          "/node_modules/", 
          "/server/"
        ],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
        exclude: [
          "/node_modules/", 
          "/server/"
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]",
            },
          },
        ],
        exclude: [
          "/node_modules/", 
          "/server/"
        ],
      }
    ],
  },
  target: "web",
  performance: {
      maxEntrypointSize: 500000,
      maxAssetSize: 500000,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "client/public", to: "" },
      ],
    }),
  ],
  devServer: {
    hot: true,
    watchFiles: [
      "client/src/**/*.*",
      "webcommons/"
    ],
    static: {
      directory: path.join(__dirname, "client", "public"),
    },
    compress: true,
    server: "spdy",
    proxy: {
      "/api": {
        target: `http://localhost:${process.env.PROXY_PORT||3000}`,
        changeOrigin: true
      }
    },
    https: true
  }
};