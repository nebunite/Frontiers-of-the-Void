
const Game = {}
Game.Log = new Soleng.Events.Observer()
Game.Display = new Soleng.Display(800, 600, Game.Log)
Game.Display.addFont("loja", "fonts/loja.otf")
Game.Display.addFont("azonix", "fonts/azonix.otf")
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
                this.corp = corp
            },
            updateScene: function () {
                let corp = this.corp
                
                let departments = corp.Departments.length
                let resources   = corp.Resources.length
                let grid = new Soleng.Graphics.Composite.Grid(
                    84,
                    10 + departments + resources
                )
                grid.drawBox(0,0,grid.width, grid.height)
                // Box out Departments
                grid.drawBox(0,3,grid.width, 3)
                // Box out Resources
                grid.drawBox(0,6+departments, grid.width, 3)
                
                grid.writeText(2, 1, corp.name)
                grid.writeText(2, 2, "Funds: " + corp.funds)
                grid.writeText(41, 2, "Operation time: " + corp.timePassed + " days")
                grid.writeText(2,4, "Department          | Productivity | Budget | Morale | Manager Skill | Operation")
                for (let i = 0; i < corp.Departments.length; i++) {
                    let department = corp.Departments[i]
                    let dN = department.name
                    let pr = department.productivity.toString()
                    let bd = department.budget.toString()
                    let mr = department.morale.toString()
                    let mn = department.manager.toString()
                    grid.writeText(2,  6+i, dN)
                    grid.writeText(22, 6+i, "| " + pr)
                    grid.writeText(37, 6+i, "| " + bd)
                    grid.writeText(46, 6+i, "| " + mr)
                    grid.writeText(55, 6+i, "| " + mn)
                    grid.writeText(71, 6+i, "| " + "Active")
                }
                grid.writeText(2, 7+departments, "Resources           | Amount       | Market Value | Volume")
                for (let i = 0; i < corp.Resources.length; i++) {
                    let resource = corp.Resources[0]
                    let rn = resource.name
                    let ra = resource.amount.toString()
                    let rm = resource.marketValue.toString()
                    let rv = resource.volume.toString()
                    grid.writeText(2,  9+departments+i, rn)
                    grid.writeText(22, 9+departments+i, "| " + ra + "m^3")
                    grid.writeText(37, 9+departments+i, "| " + rm + "/Unit")
                    grid.writeText(52, 9+departments+i, "| " + rv + "m^3/Unit")
                }
                this.Sprites = [ grid ]
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

Game.Scene.CorpGeneral.enterScene(corp)
Game.Scene.CorpGeneral.updateScene()
Game.Scene.CorpGeneral.renderScene()