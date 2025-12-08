import { max, min } from './math.js';
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
    static mix(a, b) {
        const ra = a >> 16;
        const ga = (a >> 8) & 0xff;
        const ba = a & 0xff;
        const rb = b >> 16;
        const gb = (b >> 8) & 0xff;
        const bb = b & 0xff;
        const tr = (ra + rb) / 2;
        const tg = (ga + gb) / 2;
        const tb = (ba + bb) / 2;
        return tr * 65536 + tg * 256 + tb;
    }
    static lerp(a, b, t) {
        const ra = a >> 16;
        const ga = (a >> 8) & 0xff;
        const ba = a & 0xff;
        const rb = b >> 16;
        const gb = (b >> 8) & 0xff;
        const bb = b & 0xff;
        const tr = ra + (rb - ra) * t;
        const tg = ga + (gb - ga) * t;
        const tb = ba + (bb - ba) * t;
        return tr * 65536 + tg * 256 + tb;
    }
    static lighten(a, t) {
        return this.lerp(a, this.white, t);
    }
    static blue = this.rgb(0, 0, 255);
    static red = this.rgb(255, 0, 0);
    static green = this.rgb(0, 255, 0);
    static black = this.rgb(0, 0, 0);
    static white = this.rgb(255, 255, 255);
    static yellow = this.rgb(255, 255, 0);
    static cyan = this.rgb(0, 255, 255);
    static magenta = this.rgb(255, 0, 255);
    static gray = this.rgb(128, 128, 128);
    static darkGray = this.rgb(64, 64, 64);
    static lightGray = this.rgb(192, 192, 192);
}
//# sourceMappingURL=color.js.map