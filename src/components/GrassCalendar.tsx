"use client"; //reactがweb操作できるように宣言する必要がある？

import { useMemo } from "react"; //こっちがreactでウェブ操作できるようにするやつだっけ？
import type { Session } from "@/src/types"; //typesというファイルからSessionという方をインポート


const TYPE_COLORS: Record<string, string[]> = {
    study: [
        "bg-blue-50 dark:bg-blue-950",
        "bg-blue-200 dark:bg-blue-800",
        "bg-blue-400 dark:bg-blue-600",
        "bg-blue-600 dark:bg-blue-400",
        "bg-blue-800 dark:bg-blue-300",
    ],
    workout: [
        "bg-green-50 dark:bg-green-950",
        "bg-green-200 dark:bg-green-800",
        "bg-green-400 dark:bg-green-600",
        "bg-green-600 dark:bg-green-400",
        "bg-green-800 dark:bg-green-300",
    ],
};
//学習と筋トレの色、学習は青、筋肉トレーニングは緑

const DEFAULT_COLORS = [
    "bg-gray-50 dark:bg-zinc-800",
    "bg-gray-200 dark:bg-zinc-700",
    "bg-gray-400 dark:bg-zinc-600",
    "bg-gray-600 dark:bg-zinc-500",
    "bg-gray-800 dark:bg-zinc-400",
];
//デフォルトの色は灰色、何も記録されていないときかな？

type DayData = {
    date: string;
    total: number;
    byType: Record<string, number>;
    dominantType: string;
};
//dataは文字列、totalは数字、byTypeは文字列と数字の記録、dominantTypeは文字列で型定義するというDayDataの型を定義

function getLevel(minutes: number, maxMinutes: number): number {
    if (minutes === 0) return 0;
    if (maxMinutes === 0) return 1;
    const ratio = minutes / maxMinutes;
    if (ratio <= 0.1) return 0;
    if (ratio <= 0.25) return 1;
    if (ratio <= 0.5) return 2;
    if (ratio <= 0.75) return 3;
    return 4;
}
//minutesとmaxMinutesをnumberで定義するgetlevel,もしminutesが0なら、levelは０、maxMinutesが0ならlevelを1にする。minutesをmaxMinutesで割るratioという変数を定義、ratioが0.1以下なら０、0.25以下0.1以上なら１、0.25以上0.5以下なら2、0.5以上0.75以下なら３を返す。

function aggregateByDate(sessions: Session[]): Map<string, DayData> {
    const map = new Map<string, DayData>(); //Session[]という配列で定義し、それをMapで文字列(string)とDayDataを返すことができる形にして返している。

    for (const s of sessions) {
        if (!map.has(s.date)) {
            map.set(s.date, {
                date: s.date,
                total: 0,
                byType: {},
                dominantType: "",
            });
        } //もし、マップにs.dateがないのなら、dateにs.date,toatalに０，byTypeに空配列、dominatTypeを空にする。        const day = map.get(s.date)!;
        day.total += s.duration;
        day.byType[s.type] = (day.byType[s.type] || 0) + s.duration;
    } //day.totalにs.durationを合計する。day.byType[s.type]として定義し、day.byType[s.type]か０にs.durationを合計する。ちなみにそれぞれの変数はどんなものか今あまり理解できていない。


    for (const day of map.values()) {
        let maxType = "";
        let maxVal = 0;
        for (const [type, val] of Object.entries(day.byType)) {
            if (val > maxVal) {
                maxVal = val;
                maxType = type;
            }
        }
        day.dominantType = maxType;
    }

    return map;
} //map.values()の中のdayを取出してmaxTypeを空白、maxValを０に変数定義し、そのあとObject.entries(day.byType)の配列のtype, valのを一つずつ取出し、maxValにval,maxTypeにtypeを定義する。


function formatMonthLabel(date: Date): string {
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}
// formatMonthLabelでDateという型をstringという文字列で定義し、西暦と月を持ってきてjaascriptの性質上、０から加須せるので、+1で１〜１２月を調整して、返している。

const WEEKDAY_LABELS = ["月", "火", "水", "木", "金", "土", "日"]; ///月火水木金土日の曜日を表示する配列を定義する

type Props = {
    sessions: Session[];
    weeks?: number;
};//Propという型にSession[]という配列をsessionsにして、数字をweeks?に定義する。

export default function GrassCalender({ sessions, weeks = 12 }: Props) {

    const { dayMap, maxDayMinutes } = useMemo(() => {
        const map = aggregateByDate(sessions);
        let max = 0;
        for (const day of map.values()) {
            if (day.total > max) max = day.total;
        }
        return { dayMap: map, maxDayMinutes: max };
    }, [sessions]);//日毎の時間が０ふんよりも多いなら、dayMapをmapで並べて、maxDayMinutesを０にリセット。


    const days = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const result: Date[] = [];
        const totalDays = weeks * 7;
        for (let i = totalDays - 1; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            result.push(d);
        }
        return result;
    }, [weeks]);//日毎の時間を０の初期値に設定し、結果を日付の配列に定義、合計日数を週間と７をかけるので８４かな？正直ここはGitHubと同じように見れるようにしておきたいな。


    const weeksList = useMemo(() => {
        const list: Date[][] = [];
        for (let i = 0; i < days.length; i += 7) {
            list.push(days.slice(i, i + 7));
        }
        return list;
    }, [days]);//listというDataで２つの空配列を一つの空配列にしているのかな？iを０に定義し、iが日付の長さよりも小さい場合、iに７を足す。そしてlistにdaysをsliceして、iからi+7までのコピーしたものをpushしている。でも、sliceって指定した場所は含まれないんだよね？

    const monthLabels = useMemo(() => {
        const labels: { index: number; label: string }[] = [];
        let lastMonth = -1;
        weeksList.forEach((week, idx) => {
            const month = week[6] ? week[6].getMonth() : week[0].getMonth();
            if (month !== lastMonth) {
                labels.push({ index: idx, label: formatMonthLabel(week[0]) });
                lastMonth = month;
            }
        });
        return labels;
    }, [weeksList]);//indexを数字にlabelを文字列に空配列で定義し、lastMonthは-1で定義、weekの７番目を取出し、weekの１番目（０番目？）をmonthに定義、monthとlastMonthが同じではないのなら、indexの型のidxとlabelの型のormatMonthLabelのweekの１番目（０番目？）をlabelsにプッシュする。lastMonthをmonthに書き換える。そしてlabelsを返す。

    function dateKey(d: Date): string {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }//dateKeyをstringで文字列にして、例えば2026-06-02のように表すように返している。.padStart(2,"0")でもし人気だでも前に０をおくようにしている。

    return (
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-bold text-gray-800 dark:text-zinc-100">
                アクティビティ
            </h2>

            {/*　凡例 */}
            <div className="mb-3 flex item-center gap-4 text-xs text-gray-500 dark:text-zinc-400">
                <span>少</span>
                {[0, 1, 2, 3, 4].map((level) => (
                    <span
                        key={level}
                        className={`inline-block h-3 w-3 rounded-sm ${DEFAULT_COLORS[level]}`}
                    />
                ))} {/* 0~4までの５つのレベルがあり、それをマップで当てはまるレベルに振り分けて、草の濃さを決めている。*/}
                <span>多</span>
                <span className="ml-2">|</span>
                <span className="inline-block h-3 w-3 rounded-sm bg-blue-400">
                    Study
                </span>
                <span className="flex item-center gap-1">
                    <span className="inline-block h-3 w-3 rounded-sm bg-green-400" />
                    Workout
                </span>
            </div>

            {/* カレンダーグリッド */}
            <div className="flex gap-1">
                {/* 月ラベル */}
                <div className="flex flex-col justify-start gap-0 pt-5 text-xs text-gray-400 dark:text-zinc-500">
                    {monthLabels.map((m) => (
                        <span key={m.index} style={{ marginTop: m.index === 0 ? 0 : 14 }}>
                            {m.label}
                        </span>{/* 14だから２週間分かな？でも変数名がmonthLabelsだから月ごとなんだろうけど、私の知識だとこのコード見て月ごとであるという認識はできないな。*/ }
                    ))}
                </div>

                {/* 週のグリッド */}
                <div className="flex gap-1">
                    {weeksList.map((week, wi) => (
                        <div key={wi} className="flex flex-col gap-1">
                            {week.map((d) => {
                                const dk = dateKey(d);
                                const dayData = dayMap.get(dk);
                                const total = dayData?.total || 0;
                                const dominantType = dayData?.dominantType || "";
                                const colors = TYPE_COLORS[dominantType] || DEFAULT_COLORS;
                                const level = getLevel(total, maxDayMinutes);

                                const isToday =
                                    d.toDateString() === new Date().toDateString();

                                return (
                                    <div
                                        key={dk}
                                        title={`${dk}: ${total > 0 ? `${total}分` : "記載なし"}`}
                                        className={`h-3 w-3 rounded-sm ${colors[level]} ${isToday ? "ring-2 ring-blue-400 ring-offset-1 dark:ring-offset-zinc-900" : ""}`}
                                    />
                                );//週のグリットと書いてあるが、中を見ると日毎の合計分数な気がする。
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* サマリー */}
            {dayMap.size > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
                        <p className="text-xs text-gray-500 dark:text-zinc-400">
                            学習時間
                        </p>
                        <p className="text-xl font-bold text-blue-700 dark: text-blue-300">
                            {Array.from(dayMap.values()).reduce(
                                (sum, d) => sum + (d.byType["study"] || 0),
                                0
                            )}{/* おそらく今までの合計分数を見れる。これは勉強*/}
                            <span className="ml-1 text-sm font-normal">分</span>
                        </p>
                    </div>
                    <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950">
                        <p className="text-xs text-gray-500 dark:text-zinc-400">
                            筋トレ合計
                        </p>
                        <p className="text-xl text-green-700 dark:text-green-300">
                            {Array.from(dayMap.values()).reduce(
                                (sum, d) => sum + (d.byType["workout"] || 0),
                                0
                            )}{/* これは筋トレの今までの合計分数*/}
                            <span className="ml-1 text-sm font-normal">分</span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}    
