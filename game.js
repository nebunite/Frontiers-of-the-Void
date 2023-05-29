
const Game = {}
Game.Log = new Soleng.Events.Observer()
Game.Display = new Soleng.Display(800, 600, Game.Log)
Game.World = new Soleng.WorldGeneration.Constellation(800, 600, 50)
Game.Scene = {
	WorldMap: new Soleng.Scene(
		Game.Display,
		"World Map",
		{
			enterScene: function (stars) {
				// Clear any existing Sprites
				this.Sprites = [];
				// Generate sprites for the Stars
				for (let star of stars) {
					this.Sprites.push(
						new Soleng.Graphics.Shape.Circle(
							star.x,
							star.y,
							star.mass * 5,
							star.color
						)
					)
				}
			}
		}
	),
	LocalMap: new Soleng.Scene(
		Game.Display,
		"Local Map",
		{
			enterScene: function (star) {
				this.Sprites = []
				// Render Star
				this.Sprites.push(
					new Soleng.Graphics.Shape.Circle(
						0,
						300,
						star.mass * 20,
						star.color
					)
				)
				// Render Planets
				for (let planet of star.Planets) {
					let orbit = (star.mass + 1) * 20 + (planet.orbit + 1) * 10
					this.Sprites.push(
						new Soleng.Graphics.Shape.Ring(
							0, 300, orbit, "white"))
					this.Sprites.push(
						new Soleng.Graphics.Shape.Circle(
							orbit,
							300,
							planet.mass * 5,
							"green"
						)
					)
				}
			}
		}
    ),
    CorpGeneral: new Soleng.Scene(
        Game.Display,
        "Corporation Screen",
        {
            enterScene: function (corp) {
                this.Sprites = [
                    new Soleng.Graphics.Shape.Value(
                        10, 10, corp, 'funds', 'white'
                    )
                ]
                
            }
        }
    )
}

document.body.appendChild(Game.Display.Canvas);
// Game.Scene.WorldMap.enterScene(Game.World.Stars)
// Game.Scene.WorldMap.renderScene()
// Game.Scene.LocalMap.enterScene(Game.World.Stars[0])
// Game.Scene.LocalMap.renderScene()

let corp = new Soleng.Economics.Corporations.Subsidiary()

corp.operate(100)

console.log(corp.funds)
console.log(corp.log.Log[3])


Game.Scene.CorpGeneral.enterScene(corp)
Game.Scene.CorpGeneral.renderScene()