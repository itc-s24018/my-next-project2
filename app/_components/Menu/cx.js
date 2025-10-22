/**
 * 複数スタイルの指定
 * @param {Array<string | boolean>} styles 
 * 適応するスタイル
 * @returns {string}
 */
export default function cx(...styles) {
    // console.log(styles);
    return styles.join(" ");
}

