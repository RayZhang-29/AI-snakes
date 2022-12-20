package com.AI_snakes.backend.consumer.utils;

import java.util.Random;

public class Game {
    final private Integer rows;
    final private Integer cols;
    final private Integer inner_walls_count;
    final private int[][] hasWall;
    final private static int[] dx = {-1, 0, 1, 0}, dy = {0, 1, 0, -1};

    public Game(Integer rows, Integer cols, Integer inner_walls_count) {
        this.rows = rows;
        this.cols = cols;
        this.inner_walls_count = inner_walls_count;
        this.hasWall = new int[rows][cols];
    }

    public int[][] getMap() {
        return hasWall;
    }

    private boolean check_connectivity(int sx, int sy, int tx, int ty) {
        if (sx == tx && sy == ty) return true;

        hasWall[sx][sy] = 1;
        for (int i = 0; i < 4; i ++ ) {
            int x = sx + dx[i], y = sy + dy[i];
            if (x >= 0 && x < this.rows && y >= 0 && y < this.cols && hasWall[x][y] == 0) {
                if (check_connectivity(x, y, tx, ty)) {
                    hasWall[sx][sy] = 0;
                    return true;
                }
            }
        }
        hasWall[sx][sy] = 0;

        return false;
    }

    private boolean draw() { // draw the map, 1: wall, 0:empty
        for (int i = 0 ; i < this.rows; i ++ ) {
            for (int j = 0; j < this.cols; j ++ ) {
                hasWall[i][j] = 0;
            }
        }

        for (int r = 0; r < this.rows; r ++ ) {
            hasWall[r][0] = hasWall[r][this.cols - 1] = 1;
        }
        for (int c = 0; c < this.cols; c ++ ) {
            hasWall[0][c] = hasWall[this.rows - 1][c] = 1;
        }

        Random random = new Random();
        for (int i = 0; i < this.inner_walls_count / 2; i ++ ) {
            for (int j = 0; j < 1000; j ++ ) {
                int r = random.nextInt(this.rows);
                int c = random.nextInt(this.cols);

                if (hasWall[r][c] == 1 || hasWall[this.rows - 1 - r][this.cols - 1 - c] == 1) continue;
                if (r == this.rows - 2 && c == 1 || c == this.cols - 2 && r == 1) continue;

                hasWall[r][c] = hasWall[this.rows - 1 - r][this.cols - 1 - c] = 1;
                break;
            }
        }

        return check_connectivity(this.rows - 2, 1, 1, this.cols - 2);
    }

    public void createMap() {
        for (int i = 0; i < 1000; i ++ )  {
            if (draw()) break;
        }
    }
}
