{
  description = "Anakin's Music App - React Native / Expo development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          name = "anakins-music-app";

          buildInputs = with pkgs; [
            nodejs_20
            git
          ];

          shellHook = ''
            export PATH="$PWD/node_modules/.bin:$PATH"
            echo "Anakin's Music App dev environment"
            echo "  npm install       – install dependencies"
            echo "  npm start         – start Expo dev server (scan QR with Expo Go)"
            echo "  npm test          – run Jest test suite"
            echo "  npm run test:watch – run tests in watch mode"
          '';
        };
      });
}
