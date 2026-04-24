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
            echo ""
            echo "  make        - run tests"
            echo "  make server - start dev server"
            echo ""
          '';
        };
      });
}
