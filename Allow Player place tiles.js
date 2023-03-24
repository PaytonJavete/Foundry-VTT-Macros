export class TILE_STUFF {
  /* ROUTE TILE CREATION TO THE GM */
  static createTilesSocketOn() {
    game.socket.on(`world.${game.world.id}`, (request) => {
      if (request.action === "createTiles") {
        this.createTiles(request.data.tileData, false);
      }
    });
  }

  static async createTiles(tileData, push = true) {
    if (push) {
      game.socket.emit(`world.${game.world.id}`, {
        action: "createTiles",
        data: { tileData }
      });
    }
    if (game.user.isGM) return canvas.scene.createEmbeddedDocuments("Tile", tileData);
  }
}