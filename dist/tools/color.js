import { max, min } from "./math.js";
export class Color {
    static random() {
        return (~~(Math.random() * 256) * 65536 +
            ~~(Math.random() * 256) * 256 +
            ~~(Math.random() * 256));
    }
    static rgb(r, g, b) {
        r = ~~max(min(r, 255), 0);
        g = ~~max(min(g, 255), 0);
        b = ~~max(min(b, 255), 0);
        return r * 65536 + b * 256 + b;
    }
}
//# sourceMappingURL=color.js.map