import { AcGameObject } from "./AcGameObject"; // export default non{}
import { Snake } from "./Snake";
import { Wall } from "./Wall";

export class GameMap extends AcGameObject {
    constructor(ctx, parent) {
        super();

        this.ctx = ctx;
        this.parent = parent;
        this.L = 0;
        
        // one odd, one even, prevent entering the same box at the same time
        this.rows = 13;
        this.cols = 14;

        this.walls = [];
        this.inner_wall_count = 20;

        this.snakes = [
            new Snake({id: 0, color: '#4876EC', r: this.rows - 2, c: 1}, this),
            new Snake({id: 1, color: '#F94848', r: 1, c: this.cols - 2}, this),
        ]

    
    }

    // Flood Fill Algorithm
    check_connectivity(map, sx, sy, tx, ty) {
        if (sx == tx && sy == ty) return true;
        map[sx][sy] = true;

        let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
        for (let i = 0; i < 4; i ++ ) {
            let x = sx + dx[i], y = sy + dy[i];
            if (!map[x][y] && this.check_connectivity(map, x, y, tx, ty))
                return true;
        }

        return false;
    }

    // map should be created in backend
    create_walls() {
        new Wall(0, 0, this);
        const hasWall = [];
        for (let r = 0; r < this.rows; r ++ ) {
            hasWall[r] = []
            for (let c = 0; c < this.cols; c ++ ) {
                hasWall[r][c] = false;
            }
        }

        // create walls surrounding map
        for (let r = 0; r < this.rows; r ++ ) {
            hasWall[r][0] = hasWall[r][this.cols - 1] = true;
        }
        for (let c = 0; c < this.cols; c ++ ) {
            hasWall[0][c] = hasWall[this.rows - 1][c] = true;
        }

        // create inner random walls 
        for (let i = 0; i < this.inner_wall_count / 2; i ++ ) {
            for (let j = 0; j < 1000; j ++ ) {
                let r = parseInt(Math.random() * this.rows);
                let c = parseInt(Math.random() * this.cols);
                if (hasWall[r][c] || hasWall[this.rows - 1 - r][this.cols - 1 - c]) continue;
                if (r == this.rows - 2 && c == 1 || r == 1 && this.cols - 2) continue;
                hasWall[r][c] = hasWall[this.rows - 1 - r][this.cols - 1 - c] = true;
                break;
            }
        }

        const copy_map = JSON.parse(JSON.stringify(hasWall));
        if (!this.check_connectivity(copy_map, this.rows - 2, 1, 1, this.cols - 2)) return false;

        for (let r = 0; r < this.rows; r ++ ) {
            for (let c = 0; c <this.cols; c ++ ) {
                if (hasWall[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }

        return true;
    }

    add_listening_events() {
        this.ctx.canvas.focus();

        const [snake0, snake1] = this.snakes;
        this.ctx.canvas.addEventListener("keydown", e => {
            if (e.key == 'w') snake0.set_direction(0);
            else if (e.key === 'd') snake0.set_direction(1);
            else if (e.key === 's') snake0.set_direction(2);
            else if (e.key === 'a') snake0.set_direction(3);
            else if (e.key === 'ArrowUp') snake1.set_direction(0);
            else if (e.key === 'ArrowRight') snake1.set_direction(1);
            else if (e.key === 'ArrowDown') snake1.set_direction(2);
            else if (e.key === 'ArrowLeft') snake1.set_direction(3);
        });
    }

    start() {
        for (let i = 0; i < 1000; i ++ ) {
            if (this.create_walls()) break;
        }

        this.add_listening_events();
    }

    update_size() {
        // calculate div h/w
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    check_ready() {
        for (const snake of this.snakes) {
            if (snake.status !== "idle") return false;
            if (snake.direction === -1) return false;
        }
        return true;
    }

    next_step() {
        for (const snake of this.snakes) {
            snake.next_step();
        }
    }

    check_valid(cell) { // check if the position is valid: not crash the snakes' bodies or walls
        for (const wall of this.walls) { // for loop: in--index, of--value
            if (wall.r === cell.r && wall.c == cell.c) return false; 
        }

        for (const snake of this.snakes) {
            let k = snake.cells.length;
            if (!snake.check_tail_increasing()) {
                k --;
            }
            for (let i = 0; i < k; i ++ ) {
                if (snake.cells[i].r === cell.r && snake.cells[i].c === cell.c) return false;
            }
            return true;
        }
    }

    update() {
        this.update_size();
        if (this.check_ready()) {
            this.next_step();
        }
        this.render();
    }

    render() {
        // this.ctx.fillStyle = "green";
        // this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        const color_even = "#AAD751", color_odd = "#A2D149";
        for (let r = 0; r < this.rows; r ++ ) {
            for (let c = 0; c < this.cols; c ++ ) {
                if ((r + c) % 2 == 0) {
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);
            }
        }

    }
}