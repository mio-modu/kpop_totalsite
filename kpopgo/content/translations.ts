/**
 * The translation register, and it is empty.
 *
 * The machinery exists before any translation does, for the same reason the
 * paid-link register did: knowing that a page may one day be translated
 * changes how the English is written now, and a translation added to a site
 * with no freshness rules would quietly become the undated guide this site
 * exists to replace.
 *
 * What a translation must carry is in lib/i18n.ts. What it must not do is
 * here, enforced at module scope:
 *
 *  - It cannot name a guide that does not exist.
 *  - It cannot claim a `sourceChecked` in the future, which would make a
 *    translation permanently "current" no matter what the English page did.
 *  - It cannot be translated earlier than the source it was translated from.
 *  - It must declare how it was reviewed. There is no default, because the
 *    default would be the flattering one.
 *
 * Adding a language also means `translatedLocales` in lib/i18n.ts, an entry
 * here per guide, and accepting that every source re-check now has N pages to
 * follow. That last part is the real cost and it is why this is one language
 * at a time rather than all of them at once.
 */
import { guides } from "./guides";
import { LOCALES, type Locale, type ReviewLevel, type TranslationMeta } from "@/lib/i18n";

export type TranslatedStep = {
  title: string;
  body: string;
  pitfall?: string;
  takes?: string;
};

export type Translation = TranslationMeta & {
  locale: Locale;
  /** The English guide this translates. */
  slug: string;
  title: string;
  summary: string;
  scope: string;
  intro: string[];
  steps: TranslatedStep[];
  faq: { q: string; a: string }[];
  /**
   * Localised chrome.
   *
   * Every one of these is wording the template needs in the reader's own
   * language. A notice explaining a translation, written in English, is a
   * notice for somebody who did not need the translation — so there is no
   * English fallback and the type requires all of them.
   */
  labels: {
    pitfall: string;
    takes: string;
    sources: string;
    readEnglish: string;
    /** Heading over the rail of other guides available in this language. */
    related: string;
    /** "Translated with machine assistance; not reviewed by a native speaker." */
    reviewedMachine: string;
    /** "Translation reviewed by a native speaker." */
    reviewedNative: string;
    /** Shown when the English page has been re-checked since this was made. */
    sourceMoved: string;
    /** Shown when the English page has passed its shelf life. */
    sourceStale: string;
  };
};

const DE_LABELS = {
  pitfall: "Häufiger Fehler",
  takes: "Dauer:",
  sources: "Quellen",
  readEnglish: "Englische Fassung lesen",
  related: "Weitere Anleitungen auf Deutsch",
  reviewedMachine:
    "Diese Übersetzung wurde maschinell erstellt und nicht von einer Person mit deutscher Muttersprache geprüft. Bei wichtigen Entscheidungen gelten die englische Fassung und die Originalquellen.",
  reviewedNative: "Diese Übersetzung wurde von einer Person mit deutscher Muttersprache geprüft.",
  sourceMoved:
    "Die englische Fassung wurde nach dieser Übersetzung erneut geprüft. Bei Abweichungen gilt die englische Fassung.",
  sourceStale:
    "Die englische Fassung, auf der diese Übersetzung beruht, hat ihre Gültigkeitsdauer überschritten. Bitte prüfen Sie den aktuellen Stand in der englischen Fassung und in den Quellen.",
};

const ZH_LABELS = {
  pitfall: "常見錯誤",
  takes: "所需時間：",
  sources: "資料來源",
  readEnglish: "閱讀英文版",
  related: "本語言的其他指南",
  reviewedMachine:
    "本翻譯以機器翻譯為基礎，未經母語人士校閱。涉及重要判斷時，請以英文版與原始資料來源為準。",
  reviewedNative: "本翻譯已經母語人士校閱。",
  sourceMoved:
    "英文版在本翻譯完成之後曾再次查核。若內容有出入，以英文版為準。",
  sourceStale:
    "本翻譯所依據的英文版已超過有效期限。請以英文版與資料來源確認目前的狀況。",
};

const ES_LABELS = {
  pitfall: "Error habitual",
  takes: "Tiempo estimado:",
  sources: "Fuentes",
  readEnglish: "Leer la versión en inglés",
  related: "Otras guías en este idioma",
  reviewedMachine:
    "Esta traducción se hizo con ayuda automática y no la ha revisado una persona hispanohablante nativa. Para decisiones importantes, consulte la versión en inglés y las fuentes originales.",
  reviewedNative: "Una persona hispanohablante nativa ha revisado esta traducción.",
  sourceMoved:
    "La versión en inglés se volvió a verificar después de hacer esta traducción. Si hay discrepancias, la versión en inglés es la que vale.",
  sourceStale:
    "La versión en inglés en la que se basa esta traducción ha superado su plazo de vigencia. Consulte la versión en inglés y sus fuentes para saber cómo están las cosas ahora.",
};

const ID_LABELS = {
  pitfall: "Kesalahan umum",
  takes: "Perkiraan waktu:",
  sources: "Sumber",
  readEnglish: "Baca versi bahasa Inggris",
  related: "Panduan lain dalam bahasa ini",
  reviewedMachine:
    "Terjemahan ini dibuat dengan bantuan mesin dan belum diperiksa oleh penutur asli. Untuk keputusan penting, rujuk versi bahasa Inggris dan sumber aslinya.",
  reviewedNative: "Terjemahan ini telah diperiksa oleh penutur asli.",
  sourceMoved:
    "Versi bahasa Inggris telah diperiksa ulang setelah terjemahan ini dibuat. Jika ada perbedaan, versi bahasa Inggris yang berlaku.",
  sourceStale:
    "Versi bahasa Inggris yang menjadi dasar terjemahan ini sudah melewati masa berlakunya. Periksa versi bahasa Inggris dan sumbernya untuk keadaan terkini.",
};

const JA_LABELS = {
  pitfall: "つまずきやすい点",
  takes: "所要：",
  sources: "出典",
  readEnglish: "英語版を読む",
  related: "この言語で読める他のガイド",
  reviewedMachine:
    "機械翻訳をもとにした翻訳です。ネイティブによる校閲は受けていません。正確さが重要な判断には英語版と出典をご確認ください。",
  reviewedNative: "ネイティブによる校閲を受けた翻訳です。",
  sourceMoved:
    "この翻訳を作成したあとに英語版が再確認されています。内容が食い違う場合は英語版が正です。",
  sourceStale:
    "この翻訳のもとになった英語版は有効期限を過ぎています。現在の状況は英語版と出典でご確認ください。",
};

/**
 * Two guides are deliberately in no language but English, and this is the
 * reason rather than an oversight.
 *
 * Four editions now carry the same eighteen of the twenty guides and skip the
 * same two. Three of them arrived there without being planned to, written at
 * different times for different reasons, and the fourth — German — was
 * brought up to the same eighteen deliberately once its commerce-only
 * restriction turned out to be wrong. That convergence is worth noticing,
 * because the two guides all four refuse are refused by the same test: a page
 * whose subject is a jurisdiction the reader is not in.
 *
 * One asymmetry is left standing on purpose and should not be read as part of
 * the rule. The timezone guide is excluded from the three Asian editions
 * because none of their readers observes daylight saving. Germany and Spain
 * do, so for those two it is not a mismatch at all — it is the one page whose
 * thesis fits them better than it fits the English readership it was written
 * for. German is at eighteen because eighteen was asked for; if a nineteenth
 * is ever added there, this is it.
 *
 * `kpop-ticketing-day-timezone` is the sharper of the two, because its title
 * suggests the opposite. The guide is not really about time zones; it is
 * about daylight saving. Korea has none and most of its English readership
 * does, so the local hour of a Korean sale moves two to four times a year,
 * and that arithmetic is what most of its seven steps are for. None of the
 * three target locales observes daylight saving either — verified against the
 * same IANA database the guide itself cites rather than from memory, with
 * `zdump -v` showing no transition in Asia/Tokyo, Asia/Taipei or
 * Asia/Jakarta across the next decade, and identical January and July offsets
 * in each:
 *
 *   Asia/Seoul   UTC+9    Asia/Tokyo    UTC+9   — no conversion at all
 *   Asia/Taipei  UTC+8    KST minus 1, permanently
 *   Asia/Jakarta UTC+7    KST minus 2, permanently
 *
 * So for a Japanese reader there is nothing to convert, and for a Taiwanese or
 * Indonesian one the gap is a fixed hour or two that never moves. Translating
 * it would hand all three a page mostly about New York's March clock change.
 * The parts that do apply — be verified before the window opens, and the
 * checkout clock is a separate deadline — are already in guides 01 and 12,
 * which are translated into all three.
 *
 * `kpop-album-customs-duty-overseas` covers the United States and the EU,
 * because those are the two changes there were primary sources for. No
 * reader of these three languages is in either. Worse, the page would read as
 * though it covered them: a translated customs guide is exactly the kind of
 * page a reader trusts on the one subject where being wrong costs money at a
 * border. Each would need its own national source — and for Japanese,
 * customs.go.jp and japanpost.jp are both outside this container's outbound
 * allowlist, so it cannot be written from here today even if the appetite
 * were there.
 *
 * Translating either to reach a round number would be padding, and the same
 * instinct this site refuses everywhere else.
 *
 * `weverse-shop-shipping-delays-and-cancellation` used to be on this list for
 * Chinese and Indonesian, and the reason given was that its holiday-cutoff
 * tables are the Korean and Chinese calendars, leaving a Taiwanese or
 * Indonesian reader one useful paragraph inside a page of dates that are not
 * theirs. Re-read against the guide, that undercounted. Five of its nine
 * steps and five of its eight FAQ entries carry no region at all, and the
 * first of them is the most valuable fact in the whole set — that the cancel
 * window closes on a status change rather than a clock, so it can pass while
 * you sleep. The regional steps are not dead weight for these readers
 * either: the Chinese-holiday notice is the one a Taiwanese reader is most
 * likely to read as applying to them, and the page says plainly that it does
 * not. Both translations landed on 2026-10-21. The earlier judgment is left
 * written down rather than deleted, because it was a reasonable call made on
 * a weaker reading, and that is the kind of thing worth being able to find
 * again.
 */
export const translations: Translation[] = [
  {
    locale: "ja",
    slug: "buy-k-pop-concert-tickets-from-overseas",
    sourceChecked: "2026-10-14",
    translated: "2026-10-20",
    review: "machine-assisted",
    title: "海外から韓国のK-POPコンサートチケットを買う方法",
    summary:
      "始める前に全体像を。自分の公演がどのプラットフォームで売られ、どの本人確認があり、販売開始までに何を用意しておくべきか。",
    scope:
      "韓国国内で開催される公演と、韓国の事務所が使うチケッティングプラットフォームを扱います。海外ツアー公演は現地のプロモーターが販売するため別扱いで、以下のルールは当てはまりません。",
    intro: [
      "この質問で上位に出てくるガイドのほとんどは2025年12月より前に書かれたもので、その名前ではもう存在しないサイトへ案内しています。このページがある主な理由がそれです。",
      "K-POPのチケッティングサイトは一つではありません。プラットフォームはツアーごとに事務所とプロモーターが決め、その公演の公式告知に明記されます。それ以外のすべて——どの本人確認を受けるか、海外カードが通るか、先行販売がどれだけ早く始まるか——はこの一点から決まります。",
      "ですから手順はこうです。まず公式告知を見つけ、プラットフォームを特定し、そのうえでそのプラットフォーム固有の要件に備える。逆の順でやると、販売の1時間前に「別のサイトで本人確認を済ませた状態」になります。",
    ],
    steps: [
      {
        title: "ファンの転載ではなく、公式告知を見つける",
        body: "アーティストの公式チャンネル——事務所のサイト、アーティストのWeverseコミュニティ、公式のXやInstagram——を見ます。告知には、チケッティングプラットフォーム、先行販売と一般販売の時刻（KST表記）、先行に必要な会員ティア、居住地や本人確認の条件が書かれています。スクリーンショットを撮ってください。この先のすべてが、この一つの文書に依存します。",
        pitfall:
          "ファンのアカウントは情報を集約して言い換えるため、プラットフォームを取り違えることがあり、それが販売を逃す原因になります。日程が動いたときに更新されることもまれです。",
        takes: "10分",
      },
      {
        title: "プラットフォームを特定する——レーベル名から推測しない",
        body: "HYBE所属のアーティストは概してWeverse自社のチケッティングを通ります。それ以外の韓国ツアーでは、NOL Ticket（韓国語サイト）かNOL World（その海外向け版）、YES24、Melon Ticketがよく使われます。ただしこれは傾向であってルールではありません。事務所はツアーごとにプラットフォームを変えますし、一つのツアーで韓国国内販売とグローバル販売が別のサイトに分かれることもあります。告知を読んでください。",
        pitfall:
          "「HYBEならWeverse、SMならYES24」という対応を固定とみなすのが、既存ガイドでいちばん多い誤りです。外れる頻度は無視できません。",
        takes: "5分",
      },
      {
        title: "自分が受ける本人確認を把握する",
        body: "韓国語のチケッティングサイトは概して韓国の携帯番号で本人確認を行い、その番号を得るには実務上、韓国の居住書類が必要です。それがなければ、韓国語サイトはあなたの経路ではありません。海外向けサイトはまさにこの場合のために存在し、別の手段——通常はアカウントに紐づけたパスポート情報——で確認します。どちらのサイトを使うか今決めてください。必要なアカウントはそのサイトにあります。",
        pitfall:
          "韓国語サイトを無理に通そうとするのは労力の無駄です。そして他人の身元を借りて確認を通す類の手配に、当サイトは協力しません——チケットとアカウントの両方を危険にさらします。",
        takes: "15分",
      },
      {
        title: "パスポートの表記どおりにアカウントを作る",
        body: "氏名はパスポートの機械読取領域に記載されたとおりの法律上の氏名を、生年月日はサイトが求める形式で入力します。先行販売にファンクラブ会員資格が必要な公演なら、会員情報とチケッティングアカウントで氏名と生年月日が一致していなければなりません。不一致は、入場時や本人確認時に注文が取り消される原因として記録されています。",
        pitfall:
          "ミドルネーム、ハイフン付きの姓、氏名の順序でつまずきます。会員情報が「Maria Santos」でパスポートが「Maria Elena Santos Cruz」なら不一致です。",
        takes: "20分",
      },
      {
        title: "決済手段は当日ではなく数日前に確かめる",
        body: "海外発行のカードは一般に使えますが、アカウントが海外顧客として確認済みになってからに限られることが多いです。それとは別に、韓国の加盟店への初回決済を自分の銀行が止めることがあり、アプリ内ブラウザでは3Dセキュアの認証が失敗することもあります。銀行に連絡して海外利用を有効にし、試せる流れがあるなら、まず無関係な少額決済を一度通しておいてください。",
        pitfall:
          "決済の段で カードが拒否されると、確保していた席は数分で在庫に戻ります。この工程全体でもっとも高くつく失敗であり、完全に防げる失敗でもあります。",
        takes: "1〜3日の余裕",
      },
      {
        title: "販売そのものに向けて整える",
        body: "ログインし、本人確認に必要な工程は遅くとも前日までに終えておきます。当日は開始時刻のかなり前からサインイン済みにし、端末の時計ではなく公式のKST表記を基準にしてください。希望の座席は事前に決めておきます。多くの待機列システムは、選んで決済するまでの時間を短く区切り、過ぎれば確保を解放します。",
        pitfall:
          "「念のため」と新しいシークレットウィンドウを開くのは、待機列の中でログインと再確認をやり直すということです。やめてください。",
        takes: "開始30分前",
      },
      {
        title: "転売を考える前に、転売の規制を知る",
        body: "韓国は公演法の改正でチケット転売の規制を強め、2026年8月28日に施行されました——1月に改正、2月に公布、8月下旬から施行中です。報道によれば、購入価格を超える反復的・営業的な転売を禁じ、売る側だけでなく転売目的の購入にも及び、自動化による購入に限られなくなりました。報じられている罰則には、販売額の最大50倍の罰金と収益の没収が含まれます。韓国公演については額面を超える転売は選択肢から外し、公演が公式の転売・譲渡機能を用意しているならそれを使ってください。",
        pitfall:
          "これは2026年8月から施行されたばかりの新しい法律で、「反復的」の線引きは実務でまだ固まっていません。国際的な転売サイトに出品があることは、あなたがそれを売買して安全かどうかについて何も語りません。",
        takes: "5分",
      },
    ],
    faq: [
      {
        q: "先行販売の前に会員資格が切れます。間に合うように更新すれば大丈夫ですか。",
        a: "更新が資格の締切までに反映される場合に限ります。そしてその締切は通常、先行販売そのものより早いです。Weverse Shopの自動決済（対応する会員資格で2026年9月3日から利用可能）は有効期間の最終日に登録済みの決済手段へ課金するため、空白そのものをなくします。ツアー発表のあとではなく、発表前に設定してください。",
      },
      {
        q: "K-POPのコンサートチケットを買うのに韓国の電話番号は必要ですか。",
        a: "韓国語のチケッティングサイトでは、本人確認が概して韓国の携帯番号に依存し、その取得には通常、韓国の居住書類が必要です。海外向けサイトでは一般に不要で、海外顧客を別の手段——通常はパスポート情報——で確認します。どちらに当たるかは、あなたの公演がどのプラットフォームで売られるかで決まります。",
      },
      {
        q: "海外のクレジットカードは使えますか。",
        a: "海外向けプラットフォームでは通常使えます。そして多くの場合、アカウントが海外顧客として確認済みになってからに限られます。問題のもう半分は自分の銀行だと見込んでおいてください——事前に海外利用を有効にし、3Dセキュアの認証に備えてください。",
      },
      {
        q: "ファンクラブ先行はどれくらい前に始まりますか。",
        a: "公演によって異なり、確実な答えは公式告知だけです。先行の枠は一般販売の1日以上前が多く、会員資格はさらに早い締切までに有効である必要が通常あります。前回のツアーから推測しないでください。",
      },
      {
        q: "韓国サイトとグローバルサイトは同じ待機列ですか。",
        a: "必ずしも同じではありません。同じ公演でも、韓国語販売とグローバル販売で配分・本人確認・ファンクラブの認識が別に扱われることがあります。一方で確認した会員資格が他方で自動的に認められるとは限らないので、どちらが自分に当たるか告知で確認してください。",
      },
    ],
    labels: JA_LABELS,
  },
  {
    locale: "ja",
    slug: "nol-world-ticketing-guide",
    sourceChecked: "2026-10-14",
    translated: "2026-10-20",
    review: "machine-assisted",
    title: "NOL Worldのチケット：かつてのInterpark Global",
    summary:
      "以前はinterpark Globalだったサイトです。2025年12月1日に名称が変わり、ほとんどのガイドは今も旧名へ案内しています。現在の手順を順に説明します。",
    scope:
      "韓国公演の海外向けプラットフォームを扱います。韓国語のNOL Ticketサイトは別の製品で、アカウント体系も別、本人確認もより厳格です。",
    intro: [
      "二つの名称変更が近い時期に起き、ネット上のほぼすべての英語ガイドはそのどちらも反映していません。Yanolja Coreが2025年4月にブランドをNOLの名で統合し、そのときInterpark TicketがNOL Ticketになりました。そして2025年12月1日、海外向けのinterpark GlobalがNOL Worldになりました。",
      "実務上の帰結はこうです。「Interpark Global」へ行けと書いたガイドや、その旧インターフェースのスクリーンショットは、すでに改名され再設計された製品を説明しています。それに従っているなら、古い地図で歩いていることになります。",
      "このページは現在の地図を追っています。上部の日付は、最後に確認した日です。",
    ],
    steps: [
      {
        title: "韓国語サイトではなく、海外向けサイトから始める",
        body: "NOL Worldが海外のファンにとっての玄関口です。韓国語のNOL Ticketサイトは国内向けのより厳格な本人確認を行い、韓国の居住書類を持っていないかぎり、一般にあなたの経路ではありません。両者は別のアカウントで、一方に登録しても他方は使えません。",
        pitfall:
          "検索結果や古いブックマークは今も旧ブランドに解決されます。アカウント作成に時間を使う前に、海外向けサイトにいることを確かめてください。",
        takes: "5分",
      },
      {
        title: "パスポートどおりの情報で登録する",
        body: "氏名と生年月日は、パスポートに印字されたとおりの法律上のものを使います。希望の公演にファンクラブ先行がある場合、これらは会員記録とも一致している必要があります。不一致は、先行の枠が開く前に——その最中ではなく——直してください。",
        pitfall:
          "確認済みの氏名を後から変えるのは、設定の切り替えではなくサポートへの申請手続きです。最初から正しく入れてください。",
        takes: "20分",
      },
      {
        title: "必要になる前に海外顧客の本人確認を終える",
        body: "海外顧客の本人確認はアカウントごとに一度の手続きで、NOL Worldは確認済み情報を再利用できないと明記しています。実際に購入するアカウントで確認してください——複数ある場合、確認は移りません。アカウントを削除すれば確認情報も消え、別のアカウントで確認できるようになりますが、不正利用で制限されたアカウントはそもそも削除できません。確認そのものに年齢制限はありませんが、年齢制限のある公演では予約を断られることがあります。完了通知はメールで届くので、失敗したと判断する前に迷惑メールを確認してください。",
        pitfall:
          "決済の段で本人確認がまだ保留中だと気づくのが、確保していた席を失う典型的な経路です。",
        takes: "処理を含めて1〜3日",
      },
      {
        title: "公演ごとの条件を公演ページで確認する",
        body: "アカウントごとの座席数制限、会員資格の要否、会場での身分証の要件、そしてそもそも海外購入者に開かれているかどうかは、公演ごとに設定されます。公演ページと公式告知を併せて読み、食い違う場合はあなたの公演の公式告知が優先します。",
        pitfall:
          "特定の座席ブロックや販売回次を国内購入者に限定する公演もあります。これは公演ごとの事情で、一般的なガイドからは分かりません。",
        takes: "10分",
      },
      {
        title: "受取には正しい書類を持って行く",
        body: "受取は公演当日の会場窓口で、それより前の日には行えません——NOL Worldは前日以前の受取はできないとしています。窓口は開演の1時間前に開き、予約番号と身分証が必要です。窓口自体にも列ができることを見込んでください。いったん受け取ったチケットは、紛失・盗難でも再発行されません。",
        pitfall:
          "予約の氏名、身分証の氏名、会員記録の氏名がすべて一致している必要があります。どこかに通称が入っていると問題になります。",
        takes: "—",
      },
    ],
    faq: [
      {
        q: "NOL WorldはInterpark Globalと同じものですか。",
        a: "ブランド変更後の同じ海外向けチケッティングサービスです。interpark Globalは2025年12月1日にNOL Worldへ改名されました。これはYanolja Coreが2025年4月にブランドをNOLの名で統合し、Interpark TicketがNOL Ticketになった流れに続くものです。",
      },
      {
        q: "古いブックマークが今もInterparkと表示されるのはなぜですか。",
        a: "ブランド変更が検索結果、第三者のガイド、キャッシュされたページに行き渡るには時間がかかります。保存したリンクやブログ記事からではなく、あなたの公演の公式告知からたどってください。",
      },
      {
        q: "NOL Globalは同じものですか。NOL Koreaは。",
        a: "どちらも、名称変更をうろ覚えのまま思い出そうとしたときに出てくる名前で、実際に入力されているのがそれなので、はっきり書いておく価値があります。サイトは二つです。海外向けのNOL World——2025年12月1日までinterpark Globalだったもの。そして韓国語のNOL Ticket——2025年4月までInterpark Ticketだったものです。「NOL Global」「NOL Korea」「NOL KR」で案内された場合、探しているのはほぼ確実にNOL Worldです。",
      },
      {
        q: "NOL TicketのアカウントをNOL Worldで使えますか。",
        a: "別アカウント・別の本人確認として扱ってください。ログインや完了した本人確認が引き継がれると考えず、実際に購入するサイトで確かめてください。",
      },
    ],
    labels: JA_LABELS,
  },
  {
    locale: "ja",
    slug: "nol-world-verified-member-ekyc",
    sourceChecked: "2026-10-20",
    translated: "2026-10-20",
    review: "machine-assisted",
    title: "NOL Worldの本人確認（eKYC）を海外から通す",
    summary:
      "パスポートの確認が済むまで、そもそも予約させてくれない公演があります。確認はパスポートと顔をその場で撮影する方式で、気軽にやり直せません。そしてNOL Worldが時期について出している唯一の指示を、ほとんどの人が見落としています。",
    scope:
      "NOL Worldの「Verified Member Only」本人確認について、NOL Worldが公開している内容を扱います——どの場合に必要か、撮影で何が求められるか、保存される氏名はどうなるか、何が確認を取り消したりアカウントを制限したりするか。韓国のパスポート所持者はNOL Ticketへ案内されており、そちらは別サイトの別の確認です。ここには本人確認を回避する方法は一切ありません。",
    intro: [
      "「Verified Member Only」の公演は、本人確認が済むまでそもそも予約できない公演です。決済時に警告が出るのではなく、未確認のアカウントには予約そのものが表示されません。ファンがこれに気づくのは予約開始の瞬間で、これは最悪のタイミングです。確認はパスポートと顔をその場で撮影する作業で、かかる時間はかかるからです。",
      "NOL Worldはこのサービスを、チケット転売などの不正な目的によるアクセスを制限する手段だと説明しています。これは額面どおり受け取る価値があります。この確認は一人を一アカウントに結びつけるために存在し、以下のほぼすべてのルールがそこから導かれます。",
    ],
    steps: [
      {
        title: "自分の公演に必要かどうか、そして正しいサイトにいるかを確認する",
        body: "「Verified Member Only」はアカウント単位ではなく商品単位で設定されます——NOL Worldは、商品ページで本人確認を完了した会員のみ予約できるとしています。ですから最初の問いは、自分の公演にその指定があるかどうかです。二つ目の問いは、そもそもNOL Worldにいるべきかどうか。NOL Worldは韓国のパスポート所持者にはNOL Ticketサイトを使うよう案内しており、そちらはまったく別の確認を行います。",
        pitfall:
          "本人確認を、サイトが促してくれる一度きりの雑務だと思い込むこと。Verified Member Onlyの公演では促しはありません——予約が単に存在しないだけです。",
        takes: "10分",
      },
      {
        title: "予約開始の1〜2日前に済ませる",
        body: "これはNOL World自身の指示で、このページでもっとも有用な一文です——予約開始時刻の直前に試みると混雑で支障が出る可能性があるため、遅くとも1〜2日前に本人確認を完了してください。いったん終えれば、どのVerified Member Only公演も再確認なしで予約できます。早くやる代償は一晩です。遅くやる代償は公演そのものです。",
        pitfall:
          "先行販売の10分前に撮影を始めること。混雑で失敗した確認を急ぐ方法はなく、待機列は待ってくれません。",
        takes: "2日前に30分",
      },
      {
        title: "実際に購入するアカウントで確認する",
        body: "本人確認はアカウントごとに一度で、NOL Worldは確認済み情報を再利用できないと明記しています——パスポート一つがアカウント一つを確認します。複数アカウントがあるなら、どれが本番かを決める瞬間がここです。あとから確認は移りません。NOL Worldはさらに、アカウントを削除すれば確認情報も消えて別アカウントで使えるようになるが、不正利用で制限されたアカウントはそもそも削除できないとしています。",
        pitfall:
          "たまたまログインしていたアカウントで確認し、もう一方で購入すること。その二つ目は未確認で、公演はVerified Member Onlyです。",
        takes: "決めるのに5分",
      },
      {
        title: "有効期限内のパスポート原本を用意する",
        body: "有効なパスポートのみが受け付けられ、NOL Worldは写真やコピーは不可だと明示しています——印刷したスキャン、スクリーンショット、別の画面に表示したページの撮影、いずれも不可です。パスポートが失効している場合は、更新しないと確認できません。韓国以外のパスポート所持者に代替書類の経路はありません。",
        pitfall:
          "本物がホテルの金庫にあるからと、スマホのカメラロールにあるパスポート写真に手を伸ばすこと。その試みは「コピーによる試み」として記録されます。",
        takes: "—",
      },
      {
        title: "撮影を一回目で通す",
        body: "NOL Worldは撮影が失敗する原因を公開しており、その一覧は人が急いでいるときにやることの一覧のように読めます。パスポートと顔を画面のガイドに合わせる。パスポート面と顔の両方に光の反射が入らないようにする。顔がパスポートの写真と一致していること。撮影中は少なくとも5秒間、端末を動かさないこと。そして端末の性能が低いかネットワークが不安定な場合、撮影がうまくいったように見えてもデータが正しく保存されないことがあります。失敗すると画面に理由が表示されます——やり直す前にそれを読んでください。",
        pitfall:
          "夜に片手で、ラミネート面に反射する天井灯の下でやること。パスポート面への真上からの照明が、撮影が読み取れない最大の原因です。",
        takes: "15分",
      },
      {
        title: "実際に保存された氏名を確認する",
        body: "受け付けられるのは英字の氏名のみです。NOL Worldは、パスポートの氏名が英字でない場合や特殊文字を含む場合は予約を進められず、氏名修正の申請ページへ案内されることがあるとしています——設定変更ではなく申請です。保存された氏名はMy Pageで見られるので、思い込みではなくそこで確認してください。これが今重要なのは、確認後は氏名・生年月日・メールアドレスを一切変更できなくなるからです。予約は確認済みの情報でしか行えません。",
        pitfall:
          "確認が成功したからと氏名を見ないままにすること。成功することと正しい文字が保存されることは別の話で、そのうち一方はもう編集できません。",
        takes: "5分",
      },
      {
        title: "氏名の順序を理解する——そして入場で実際に効くのは何か",
        body: "NOL Worldは2025年4月16日に保存する氏名の順序を変更しました。その日より前に確認した会員は「名＋（ミドルネーム）＋姓」、後に確認した会員は「姓＋名＋（ミドルネーム）」です。NOL Worldは、順序がパスポートと違っていてもチケットの本人確認と会場入場は可能だと明言しています——現場で制限されるのは、氏名そのものがパスポートと異なる場合だけです。2025年4月16日より前に確認した会員は、パスポート失効後に再確認した時点で新しい形式が適用されます。",
        pitfall:
          "順序がおかしく見えるからと氏名修正を申請すること。NOL Worldは順序は問題ではないと言っています。問題なのは氏名が違うことです。直すのは文字であって順番ではありません。",
        takes: "5分",
      },
      {
        title: "いったん通った確認が取り消される条件を知る",
        body: "完了した本人確認は、あとから取り消されることがあります。NOL Worldは原因を二つ挙げています——偽造・変造された身分証による確認の試み（印刷したコピーやスクリーンショットもこれに含むと定義しています）、そして確認に使ったパスポートの失効です。取り消された場合は、既存のアカウントで再確認してください。NOL Worldは、代わりに新しいアカウントで試すとシステムエラーが繰り返される可能性があると特に警告しており、不正な手段で得られたと判断された確認は予約サービスの利用資格を失わせうるとしています。",
        pitfall:
          "取り消しから逃れるために新しいアカウントを作ること。取り消しはアカウントではなく書類に付いていったので、新しいアカウントは問題と疑いの両方を引き継ぎます。",
        takes: "—",
      },
      {
        title: "プラットフォームが不正とみなす行為と、その代償を知る",
        body: "確認がここまで厳しい理由はNOL Worldの不正防止ポリシーにあり、その帰結も公開されています。盗難・偽造の身分証を本人確認に使うことは不正利用として挙げられています。同一または類似の個人情報——複数アカウントで同じ連絡先、配送先、決済情報——を使い、通常の利用範囲を超えて複数枚を予約することも同様です。罰則は3か月以上の予約制限から、アカウントの永久停止、予約済みチケット全件の取り消しに及びます。主催者が独自の措置を追加することもあり、ファンクラブからの除名も含まれます。異議申立ての手続きはありますが、不正取引が明確に確認された場合にはありません。",
        pitfall:
          "先行販売の確率を上げるため、一台の端末・一つの住所・一枚のカードで家族のアカウントをいくつも確認すること。そのパターンは公開された一覧に載っており、示されている罰則はそれらすべてのアカウントの全チケットに及びます。",
        takes: "読むのに10分",
      },
    ],
    faq: [
      {
        q: "公演ページの「Verified Member Only」は実際に何を意味しますか。",
        a: "その公演が未確認のアカウントには閉じられている、ということです。NOL Worldはこれを、購入前に会員が本人確認を行えるサービスで、商品ページで確認を完了した会員のみ予約できる、と説明しています。目的は、チケット転売などの不正な目的によるアクセスの制限だとしています。確認にはパスポートとスマートフォンの両方が必要なので、手元に用意してください。",
      },
      {
        q: "韓国のパスポートを持っています。NOL Worldで確認すればいいですか。",
        a: "NOL Worldは韓国のパスポート所持者にはNOL Ticketサイトを使うよう案内しています。そちらは別サイトで、確認方法も異なり——通常は韓国の携帯認証かI-PIN——アカウントも別です。",
      },
      {
        q: "海外在住の韓国国籍で、韓国の携帯番号がありません。どうすればいいですか。",
        a: "NOL Worldは書類による経路を公開しています。海外在住の韓国国民はNOL Ticketへ案内され、そこでは携帯認証またはI-PINで本人確認ができます。住民登録番号がなく携帯認証も使えない場合は、在外国民であることを証明する書類——在外国民登録簿謄本と韓国のパスポート——をアカウントIDとともにカスタマーサポートの問い合わせフォームから提出すれば受け付けるとしています。当該証明書は在外同胞庁のオンラインで取得できるとし、取得が難しい場合は外国人登録証が代替として認められることがあるとしています。また、提出書類が偽造と判明した場合は即時に利用制限となると警告しています。",
      },
      {
        q: "本人確認に年齢制限はありますか。",
        a: "NOL Worldは本人確認そのものに年齢制限はないとしていますが、年齢制限のある商品では予約や入場ができない場合があるとしています。確認が済んでいることは、特定の公演の対象になることと同じではありません。",
      },
      {
        q: "My Pageの氏名の順序がパスポートと違います。会場で止められますか。",
        a: "NOL Worldは止められないとしています。2025年4月16日に保存順序を変更し、順序がパスポートと異なってもチケットの本人確認と入場は可能だと明言しています。現場で制限されるのは氏名そのものが違う場合だけなので、確認するのは綴りと文字であって順番ではありません。",
      },
      {
        q: "確認後にパスポートが失効しました。何かする必要がありますか。",
        a: "あります。NOL Worldはパスポートの失効を、完了した本人確認が取り消される原因として挙げているので、更新したら再確認が必要です——新しいアカウントではなく、既存のアカウントで行ってください。2025年4月16日より前に確認していた場合は、このときに新しい氏名順序が記録に適用されます。",
      },
      {
        q: "自分のパスポートが失効しているのですが、家族のパスポートで確認できますか。",
        a: "できません。そしてこれは、意見ではなく公開された帰結がある唯一の質問です。NOL Worldは、盗難・偽造の身分証を本人確認に使うことを不正利用として扱う行為の一覧に挙げており、示されている罰則はアカウントの永久停止と予約済みチケット全件の取り消しに及びます。さらに、会場で本人確認を行う場合があるとし、自分の氏名とアカウントで予約し、有効な写真付き身分証を持参するよう求めています。入場を通れないチケットはチケットではありません。",
      },
      {
        q: "アカウントが制限されました。異議申立てはできますか。",
        a: "NOL Worldは手続きを公開しています。利用者には通常、少なくとも1日の説明の機会が与えられるとし、申立ては制限されたアカウントID・氏名・連絡先を含む詳細な説明書を、カスタマーサポートの問い合わせフォームから送るものとしています。所定の書式はありません。審査は概ね10〜15日で、結果はメールで通知されます。限界も明記されています——期限内に提出しない場合や疑いを払拭できない場合は予約が強制取り消しとなり、不正取引が明確に確認された場合は異議申立ての機会なく取り消されることがあります。",
      },
    ],
    labels: JA_LABELS,
  },
  {
    locale: "ja",
    slug: "nol-world-booking-fees-and-checkout-clock",
    sourceChecked: "2026-10-20",
    translated: "2026-10-20",
    review: "machine-assisted",
    title: "NOL Worldの決済：予約手数料、制限時間、そして支払う通貨",
    summary:
      "コンサートのチケットには8,000ウォンの予約手数料がつき、座席選択に10分、決済に7分。そして決済画面は通貨の選択を求めてきます。お金に関わる決定が三つと、タイマーが一つ。どれも公開されていて、どれも自明ではありません。",
    scope:
      "NOL Worldが公開している、決済の費用と時間について扱います——ジャンル別の予約手数料、二段階の購入制限時間、通貨の選択、クーポン、注文単位の枚数制限。手数料も制限時間も公演ごとに設定され、NOL Worldはその両方についてそう述べているので、あなたの公演ページが優先します。どの通貨があなたのカードで安いかについての助言は、ここにはありません。",
    intro: [
      "韓国の決済画面でうまくいかないことの大半は、カードのせいではありません。ページがお金の絡む質問を三つ投げてくる間にタイマーが動いていて、海外の購入者はそのすべてに初めて、残り7分ほどの状態で出会う——それが原因です。",
      "すべて公開されています。そして、チケットを買えると判断した商品ページには一つも書かれていません。ですからこのページの目的は、驚きを前の週に移しておくことです。",
    ],
    steps: [
      {
        title: "チケット代を判断する前に予約手数料を足す",
        body: "NOL Worldは予約手数料をジャンル別に公開しています。ミュージカルとコンサートは8,000ウォン——オンラインコンサートやファンクラブ会員資格など一部の商品を除く。それ以外の公演とスポーツは3,000ウォン。レジャーと展示は無料です。NOL Worldは手数料が商品によって異なる場合があるので購入時に確認するよう併記しているので、これは公開された基準値であって、あなたの公演についての約束ではないと受け取ってください。",
        pitfall:
          "韓国のチケット価格を自国のチケット価格と比べて、これが上に乗ることを忘れること。額は大きくありませんが、最悪のタイミングでプラットフォーム全体を信用できなくさせる種類の小さな驚きです。",
        takes: "2分",
      },
      {
        title: "その手数料が何を買っているかを知る。一行だけ重要です",
        body: "NOL Worldは予約手数料の内訳を明記しています——サイトの維持と関連費用、不正検知システムを支える決済処理、ボットやマクロによる不正予約を防ぐ技術費用、そしてグローバル予約のためのシステム支援。興味深いのは三つ目です。手数料の一部はアンチマクロの仕組みを支えており、これは本人確認や改正公演法と同じ方向の執行です。そして待機列が列というより敵対的なシステムのように振る舞う理由もそこにあります。",
        pitfall:
          "手数料を純粋な利益、待機列を無能さと読むこと。プラットフォームは、自動の購入者を排除することに手数料を使っていると述べています。それは、あなたに課されるルールが厳しい理由でもあります。",
        takes: "2分",
      },
      {
        title: "時計を理解する：選択に10分、決済に7分",
        body: "購入のタイマーは二段階で、NOL Worldは両方を明記しています。予約ページに入ってから座席選択に最大10分。価格の段へ進むと、決済を終えるまで7分間座席が確保され、ページ上部にタイマーが表示されます。過ぎると座席は自動的に解放され、予約をやり直すことになります。自由席・指定なしの予約でも決済前の10分制限は適用されます。NOL Worldは、制限は公演ごとに異なる場合があり、制限のない公演もあると付け加えています。",
        pitfall:
          "7分の中で、カード番号を探すために銀行アプリを開くこと。カード情報、請求先住所、銀行の承認アプリは、予約ページに入る前にすべて手元に整えておいてください。時計は、あなたのスマホが再ログインを求めてきた事情を考慮しません。",
        takes: "全部使えば17分",
      },
      {
        title: "通貨の質問を、実際の決定として扱う",
        body: "NOL Worldは韓国ウォン、米ドル、円、人民元を含む24通貨での決済に対応し、利用できる通貨はカード情報を入力したあとに表示されます。提示される選択は、カード発行国の通貨と韓国ウォンのどちらかです。それは、異なる二者が決めた異なる二つの為替レートです——一方は決済画面側で換算する者、もう一方はあなたのカードネットワークと発行会社。自国通貨を選ぶのはダイナミック・カレンシー・コンバージョン（DCC）で、換算する側がレートを決めて上乗せを取るため、ウォン払いのほうが通常は安くなります。「通常は」であって「常に」ではありません——自分のカードの海外取引手数料はどちらを選んでもかかり、発行会社の上乗せが大きければ差は縮まります。当日より前に実際に確認できるのは発行会社の条件なので、そこは調べておいてください。",
        pitfall:
          "数字が馴染むからと自国通貨を選ぶこと。ここでは馴染むほうが高くつく場合のほうが多く、そしてここは、誰が換算するかをあなたが選ぶ唯一の画面です。",
        takes: "事前に銀行へ10分",
      },
      {
        title: "クーポンは決済前に適用する。あとはありません",
        body: "NOL Worldはこれを率直に述べています——決済が完了するとクーポンは適用できません。提示される唯一の経路は、同じ座席をキャンセルしてクーポンを適用して予約し直すことで、キャンセルと再予約には公演独自の規定による手数料がかかる場合があると警告しています。先に手数料を確認してください。そしてクーポンの価値と正直に比べてください。手放した座席は、再予約する間あなたのために取っておかれません。",
        pitfall:
          "使えるかどうか分からない割引のために、実際に持っている座席をキャンセルすること。クーポンはチケットより価値が低く、在庫は待ってくれません。",
        takes: "5分",
      },
      {
        title: "枚数制限を見込む。そしてそれは主催者のものです",
        body: "NOL Worldは、主催者によって、ある公演で注文ごとまたは会員ごとに予約できる枚数に制限が設けられる場合があるとしています。さらに、コンサートのチケットがツアーやその他の入場券と組み合わせて販売される場合、主催者が会員ごとの制限を課すこともあるとしています。つまり上限は、調べれば分かるプラットフォーム共通の数字ではありません。公演ごとに設定され、取引ごとではなく人ごとのこともあり、グループでの注文が最後の段で失敗する理由にもなります。",
        pitfall:
          "別の公演で読んだ上限をもとに4人分の注文を計画すること。会員ごとの制限は、自分のアカウントを複数に分けても解決しません——そのパターンはNOL Worldが公開している不正利用の一覧に載っています。",
        takes: "5分",
      },
      {
        title: "予約が存在することを、状態が見える場所で確認する",
        body: "決済後、NOL Worldのサイトかアプリを開き、Account/My から My Reservations へ進みます。NOL Worldは、基本的な予約内容と状態が一覧と予約詳細ページの両方で見られるとしています。まだ机に向かっているうちに一度やっておいてください——確認メールがすべての真実だと思い込まずに。予約一覧は、想定と違う状態が現れる場所であり、サポートに連絡したときに尋ねられる画面でもあります。",
        pitfall:
          "決済が通ったことを、予約が存在することと同じだと扱うこと。たいていは同じで、確認する意味があるのは同じでないときのためです。",
        takes: "2分",
      },
      {
        title: "自分が買ったものにとっての「完了」を知る",
        body: "舞台公演とコンサートについては、NOL Worldは決済の時点で手続きは完了で、会場の窓口で受け取るとしています。ツアーやアクティビティの商品は一様ではありません。QRコードやバーコードがMy Pageかメールに届いて直接入場できるものもあり、現地のカウンターでバウチャーまたは予約確認書を提示し、入場前に実物のチケットに引き換える必要があるものもあります。NOL Worldの指示は、どちらに当たるか商品ページで確認することです。その違いが、入口の前にカウンターを探す必要があるかどうかを決めます。",
        pitfall:
          "メールのQRコードを入場券だと思い込むこと。引換式の商品ではそれはカウンターで交換するものであり、カウンターには営業時間があります。",
        takes: "5分",
      },
    ],
    faq: [
      {
        q: "コンサートチケットの予約手数料はいくらですか。",
        a: "NOL Worldはミュージカルとコンサートに8,000ウォン（オンラインコンサートやファンクラブ会員資格など一部商品を除く）、それ以外の公演とスポーツに3,000ウォン、レジャーと展示は無料と公開しています。手数料は商品によって異なる場合があり購入時に確認するよう併記されているので、ご自身の公演で確かめてください。",
      },
      {
        q: "決済の時間は実際どれくらいありますか。",
        a: "予約ページに入ってから座席選択に10分、その後、決済中は7分間座席が確保され、上部にタイマーが表示されます。過ぎると座席は解放され、やり直しです。自由席でも10分は適用されます。NOL Worldは、制限は公演ごとに異なることがあり、制限のない公演もあるとしています。",
      },
      {
        q: "韓国ウォンで払うべきですか、自国通貨で払うべきですか。",
        a: "通常はウォンです。NOL Worldは24通貨に対応し、カード発行国の通貨と韓国ウォンのどちらかを選べて、選択肢はカード情報の入力後に表示されます。自国通貨を選ぶのはDCC（ダイナミック・カレンシー・コンバージョン）で、換算する側がレートを決めて上乗せを加えるため、ウォンのほうが一般に安くなります。自分のカードの海外取引手数料はどちらでもかかるので、そこは当日より前に発行会社へ確認してください。",
      },
      {
        q: "クーポンを使い忘れました。今から追加できますか。",
        a: "できません。NOL Worldは、決済が完了するとクーポンは適用できないとしています。示されている唯一の経路は、同じ座席をキャンセルしてクーポンを適用して予約し直すことで、キャンセルと再予約には公演の規定による手数料がかかる場合があると警告しています。すでに持っている座席を手放す前に手数料を確認してください。",
      },
      {
        q: "友人は4枚買えたのに、私は2枚しか買えないのはなぜですか。",
        a: "上限がプラットフォームではなく主催者のものだからです。NOL Worldは、公演が注文ごとまたは会員ごとに枚数を制限する場合があり、コンサートとツアーの組み合わせ商品では会員ごとの制限が加わることもあるとしています。別の公演、別の販売回次では上限が違うことがあります。",
      },
      {
        q: "NOL Worldで韓国のクレジットカードは使えますか。",
        a: "使えません。NOL Worldは韓国外で発行されたカードのみを受け付けます。韓国発行のカードは、韓国サイトの確認済み国内会員のものです。ここで韓国のカードが拒否されるのは、ルールが働いているのであって不具合ではありません。",
      },
      {
        q: "予約が通ったかどこで確認しますか。",
        a: "NOL Worldのサイトかアプリの Account/My から My Reservations です。NOL Worldは、予約内容と状態が一覧と詳細ページの両方に表示されるとしています。状態を示すのは確認メールではなく、その画面です。",
      },
      {
        q: "決済は済みました。公演前にまだやることはありますか。",
        a: "コンサートや舞台公演のチケットならありません——NOL Worldは手続きは完了で、会場の窓口で受け取るとしています。ツアーやアクティビティの商品は場合によります。QRコードやバーコードで直接入場できるものもあり、先に現地カウンターでバウチャーを実物のチケットに引き換える必要があるものもあります。どちらかは商品ページに書かれています。",
      },
    ],
    labels: JA_LABELS,
  },
  {
    locale: "ja",
    slug: "nol-world-mobile-ticket-and-entry",
    sourceChecked: "2026-10-20",
    translated: "2026-10-20",
    review: "machine-assisted",
    title: "NOL Worldのモバイルチケット：QR、PIN、そして入場",
    summary:
      "チケットはスマホでしか開かず、英語のみの表示なのでブラウザの自動翻訳が内容を壊します。送ったチケットには24時間のPIN期限があり、遅刻しての入場は保証されていません。全工程の最後の20分を、順番どおりに。",
    scope:
      "NOL Worldが公開しているモバイルチケットと会場入場について扱います——チケットが開く場所、それを隠す二つのブラウザ状態、送信と受信とPINの期限、代理受取、遅刻入場。待機列の仕組みは別のガイドにあります。顔認証入場は別の仕組みで、こちらも専用のガイドがあります。",
    intro: [
      "このサイトの他のすべては準備です。ここは、航空券とホテルと先行販売が座席になるかならないかが決まる場面で、しかも電波の悪い人混みの中で握っているスマホの上で進みます。",
      "ここで起きる失敗のほとんどは劇的ではありません。ブラウザのモードが違ってチケットの場所にQRコードが出ている。翻訳機能がゲート番号を書き換えている。友人が寝ている間にPINの期限が切れた。四つともNOL Worldが文書化していて、四つとも前日の夜に防げます。",
    ],
    steps: [
      {
        title: "自分が持っているチケットの種類を知る",
        body: "受取方法は予約したときに決まっており、以下のすべてを左右します。モバイルチケットはアカウントの中にあり、画面から読み取られます。会場受取は公演当日に窓口で受け取る紙のチケットで、NOL Worldはそれを前日以前には出しません——窓口は1時間前に開き、いったん受け取ったチケットは紛失・盗難でも再発行されません。会場ではなく今、どちらかを確認してください。",
        pitfall:
          "前回のコンサートがそうだったからと、どの予約もモバイルチケットだと思い込むこと。これは予約ごとの性質で、二つの経路はまったく別の形で失敗します。",
        takes: "5分",
      },
      {
        title: "入場に使うスマホでモバイルチケットを開く",
        body: "NOL Worldは、モバイルチケットはNOL Worldアプリかモバイルウェブでのみ利用できるとしています。入場はチケット上のQRコードで行います。スマホでの経路は、アプリまたはモバイルウェブ、ログイン、Account/My、My Reservations、そしてMobile Ticketボタンです。デスクトップでは同じボタンがQRコードを表示しますが、それはあなたのチケットではありません——スマホで読み取ってそちらでチケットを開くための受け渡しです。",
        pitfall:
          "念のためチケットをスクリーンショットして、その画像を見せるつもりでいること。アカウントの中で生成されるチケットと、その写真は別のものです。入口はその違いを知る場所ではありません。",
        takes: "前日の夜に10分",
      },
      {
        title: "出かける前にブラウザの翻訳を切る",
        body: "NOL Worldは、モバイルチケットは英語のみで提供されるとし、他の言語が表示されているならそれはブラウザの自動翻訳であり、翻訳を切って再読み込みするのが対処だとしています。この読者層にとって、それは例外ではなくブラウザの既定の状態です。自動翻訳がゲート、ブロック、座席の列を書き換えるのは、入口で誰かが読み上げるまで気づけない種類の問題です。",
        pitfall:
          "旅のあいだ役に立ってきたから翻訳を入れたままにすること。役に立っていたのは韓国語のページを訳していたからです。ここではページがすでに英語で、翻訳にできることは損害だけです。",
        takes: "2分",
      },
      {
        title: "チケットの場所にQRコードが出ていたら、ブラウザのモードを直す",
        body: "チケットが消えたように見える最大の原因はこれで、不具合ではありません。NOL Worldは、ブラウザがデスクトップモードだとモバイルチケットの代わりにQRコードが表示されるとし、そのQRの下にチケットを開くView Ticketsボタンがあるとしています。そうでなければブラウザをモバイルモードに切り替えます——Chromeは三点メニューの「モバイル版サイトを見る」、Safariはアドレスバー左の言語ボタンから「モバイル用Webサイトを表示」、Samsung Internetは三本線メニューの「モバイルサイト」です。",
        pitfall:
          "そのQRコードを入口で読み取らせること。それはデスクトップ受け渡し用のコードであって入場コードではなく、必要なものはその一つ下にあります。",
        takes: "2分",
      },
      {
        title: "チケットを送ることが何を確定させるかを理解する",
        body: "モバイルチケットの共有は一方向です。購入者が来場者へ送るもので、NOL Worldは受け取ったチケットを転送することはできず、予約したチケットのみ送れるとしています。送信は公演当日まで可能です。すべての商品で使えるわけではなく、販売者が提供していない場合はSendボタンがそもそも表示されません。そして送信の代償はあなた自身の退路です——チケットの送信が成功すると、NOL Worldは予約のキャンセルを制限し、受け取った側が登録を解除したときにのみ戻ります。",
        pitfall:
          "予約した週にみんなへチケットを送って段取りを整えること。そのとき各自に、その予約をキャンセルする拒否権を渡しています。",
        takes: "5分",
      },
      {
        title: "受け取る側なら、PINを24時間の時計として扱う",
        body: "受け取ったチケットは登録するまで使えず、その窓は短いです。NOL Worldは、PINは送信から24時間以内にのみ登録でき、それを過ぎると——あるいは観覧日までに登録されないと——チケットは送信者に戻るとしています。登録はメッセージまたはメールのURLから進みます：Received Mobile Ticket、Ticket Register、そしてメッセージ内のPIN。その後チケットはMy Page、Received Mobile Ticket、Booking Historyの下にあります。返却も同じ経路のReturnボタンで、NOL Worldは登録済みのチケットでも返却できるとしています。",
        pitfall:
          "その24時間がほぼ夜になる時差の友人へ送ること。チケットは何も告げずに戻ってきて予約はあなたのものになります。火曜なら問題なく、公演当日の朝なら問題です。",
        takes: "24時間以内に5分",
      },
      {
        title: "代理受取を前提にする前に、公演ページを確認する",
        body: "NOL Worldは購入者以外による受取を認めていますが、現実的な条件が付いています。手続きは会場によって異なり、公演の種類によって代理受取が制限される場合があり、NOL Worldの指示は予約した公演の詳細ページの案内を確認することです。代理の人に必要なのは、My Ticketから印刷した予約内容、予約番号、そして購入者の身分証です。その最後の要件は、限界としてそのまま受け取ってください——購入者本人の確認済みの身元で入場を管理する公演では、代理を前提に計画しないことです。",
        pitfall:
          "代理受取を一般的な権利として読むこと。会場ごと・公演ごとの許容であり、断られる可能性が高いのはまさに、先行販売が必要だった人気公演です。",
        takes: "10分",
      },
      {
        title: "遅刻を、まだ自分の席がある状態として扱わない",
        body: "NOL Worldは、開演後の入場は公演によるとし、まったく認めない公演もあると明言しています——特にクラシックのコンサートとオペラを挙げています。遅刻入場が認められる場合でも、休憩まで待って後半から観ることになる場合があります。そして入れてもらえたとしても、休憩までは自分の席に着けない場合があるとしています。つまり遅刻は、観に来たその部分を立ったまま、あるいは別の場所で過ごすことを意味しえます。",
        pitfall:
          "開演時刻から到着時間を逆算すること。逆算するのは入場の列、保安検査、受取窓口からです。どれも開演より前に起き、どれも待ってくれません。",
        takes: "—",
      },
    ],
    faq: [
      {
        q: "チケットのところにQRコードが出ています。予約が壊れたのですか。",
        a: "いいえ——ブラウザがデスクトップモードです。NOL Worldは、それによってモバイルチケットの代わりにQRコードが表示され、その下のView Ticketsボタンでチケットが開くとしています。ブラウザをモバイルモードに切り替えることもできます：Chromeは三点メニューの「モバイル版サイトを見る」、Safariは言語ボタンの「モバイル用Webサイトを表示」、Samsung Internetは三本線メニューの「モバイルサイト」です。",
      },
      {
        q: "モバイルチケットが違う言語で表示されます。",
        a: "NOL Worldはモバイルチケットを英語のみで提供しているので、他の言語ならブラウザが自動翻訳しています。翻訳を切って再読み込みしてください。入口ではなく渡航前にやっておく価値があります。訳されたゲート番号や座席列は、気づきにくい形で間違っているからです。",
      },
      {
        q: "入口でノートPCからチケットを見せられますか。",
        a: "NOL Worldは、モバイルチケットはアプリかモバイルウェブでのみ利用できるとしています。デスクトップではMobile TicketボタンがQRコードを出し、それをスマホで読み取ると実際のチケットがそちらで開きます。入場はスマホで行う前提で計画してください。",
      },
      {
        q: "友人が窓口で私のチケットを受け取れますか。",
        a: "場合によります。NOL Worldは購入者以外も受け取れるとしていますが、手続きは会場によって異なり、公演の種類によって代理受取が制限されることがあるとしています——ですからあなたの公演の詳細ページの案内が判断の根拠です。代理の人には、My Ticketから印刷した予約内容、予約番号、購入者の身分証が必要です。入場時に購入者の身元を確認する公演では、これを前提にしないでください。",
      },
      {
        q: "モバイルチケットを間違って送ってしまいました。取り戻せますか。",
        a: "相手がまだ登録していなければ取り戻せます——NOL Worldは、送信者がCancel Sendボタンで共有を取り消せるとしています。受取側が24時間以内、または観覧日までに登録しなければ自動的に戻ります。登録されてしまった場合、取り戻すのは相手の操作です：My Page、Received Mobile Ticket、Booking History、Mobile Ticket、Returnです。",
      },
      {
        q: "送ったチケットを友人が登録しなかったらどうなりますか。",
        a: "あなたに戻ってきます。NOL Worldは、登録されないチケットは24時間後、または観覧日までに登録されなければ自動的に送信者へ返却されるとしています。それで予約は——キャンセルの規定に従えばキャンセルできる状態も含めて——戻りますが、静かに進む処理なので、思い込まずに確認してください。",
      },
      {
        q: "20分ほど遅れそうです。入れてもらえますか。",
        a: "公演によりますし、誰も約束できません。NOL Worldは、開演後の入場は公演によるとし、まったく認めない公演もある——特にクラシックのコンサートとオペラ——としています。認められる場合でも休憩まで待つことがあり、そのときまで自分の席に着けないこともあります。",
      },
      {
        q: "モバイルチケットは顔認証入場と同じものですか。",
        a: "違います。NOL facepassは、入口のカメラがチケット確認なしで通す別の仕組みで、対応は公演ごとに設定されます。モバイルチケットとそのQRコードは通常の経路であり、顔を登録していても機能する状態にしておくべき経路です。",
      },
    ],
    labels: JA_LABELS,
  },
  {
    locale: "ja",
    slug: "fan-club-presale-checklist",
    sourceChecked: "2026-10-14",
    translated: "2026-10-20",
    review: "machine-assisted",
    title: "ファンクラブ先行：締切までに資格を満たす方法",
    summary:
      "会員であることは、そのままアクセス権ではありません。その二つの間に認証の工程があり、独自の締切を持っています。そこを落とすのが、ファンが先行を失ういちばん多い原因です。",
    scope:
      "韓国公演におけるファンクラブ先行の資格取得の一般的な流れを扱います。ティア、締切、条件はツアーごとに公式告知で設定され、一般的な説明より告知が優先します。",
    intro: [
      "先行アクセスは三つの輪がつながった鎖で、ファンはふつう最初の輪しか知りません。会員資格を買う。次にその会員資格をチケッティングのアカウントに紐づけて認証する。そこで初めて先行の権利が得られます。",
      "輪ごとに締切があり、認証の締切は思っているより早いのが通例です——場合によっては先行販売の数日前です。前夜に買った会員資格は、有効であっても間に合わないことがあります。",
      "告知を仕様書として扱い、このページはチェックリストとして使ってください。",
    ],
    steps: [
      {
        title: "見出しではなく、資格条件の条文を読む",
        body: "告知には、どの会員商品とティアが資格を満たすか、そしていつまでに購入または有効である必要があるかが明記されます。この二つは別の日付で、どちらも重要です。KSTと併せて、自分のタイムゾーンでも書き出しておいてください。",
        pitfall:
          "有効だが締切後に購入した会員資格は、ツアーによっては資格を満たしません。「会員資格を持っている」は「資格を満たした」と同じではありません。",
        takes: "10分",
      },
      {
        title: "締切よりかなり前に会員資格を買う",
        body: "そのアーティストの公式ストアで購入してください。注文確認と会員番号は保管します。会員資格が実物キット＋デジタルコードの形なら、コードの配送と有効化にかかる時間を見込んでください——即時ではありません。2026年9月3日からWeverse Shopは対応する会員資格で自動決済も提供しています。有効期間の最終日に登録済みの決済手段へ更新分が課金されるため、ツアーが発表された週に気づかないまま失効することがなくなります。これは会員カテゴリ単位の設定で、Global、Japan、USAは別に管理されます。",
        pitfall:
          "転売・譲渡された会員コードは、登録名があなたのチケッティングアカウントと一致しないため、認証で落ちることが多いです。自動決済は失効のリスクをなくしますが、氏名のリスクはなくしません——紐づいているアカウントを更新するだけです。",
        takes: "30分",
      },
      {
        title: "チケッティング側で会員資格を紐づけて認証する",
        body: "ここが落ちる工程です。チケッティングのプラットフォーム側に、ファンクラブ資格を認証する別の操作があり、それは期間限定で開きます——よくあるのは先行の数日前で、先行より前に閉じます。開いたその時間にやってください。",
        pitfall:
          "同じ公演でも、韓国語販売とグローバル販売で認証が別に扱われることがあります。一方を完了しても、もう一方の資格が付与されるとは限りません。",
        takes: "期間内に20分",
      },
      {
        title: "三つの氏名を完全に一致させる",
        body: "パスポート、ファンクラブ会員資格、チケッティングアカウント。三つすべてです。同じ法律上の氏名、同じ生年月日、同じ順序。どれか一つが違うなら、認証期間の後ではなく前に直してください。",
        pitfall:
          "これは先行の権利が適用されない原因として最も多く記録されているもので、しかも実際に効く瞬間まで目に見えません。",
        takes: "15分",
      },
      {
        title: "権利が実際に付与されたか確認する",
        body: "認証後、明示的な確認——バッジ、ステータス表示、メール——を探してください。資格があるという肯定的な確認が見つからないなら、ないものと想定して、期間が開いているうちにサポートへ連絡してください。",
        pitfall:
          "無反応は成功ではありません。提出したフォームは、付与された権利ではありません。",
        takes: "10分",
      },
    ],
    faq: [
      {
        q: "会員資格を買えば先行アクセスは保証されますか。",
        a: "いいえ。ほとんどのツアーでは、会員資格をチケッティングアカウントに紐づける別の認証工程があり、独自の期間が先行より前に開いて閉じます。会員資格は前提条件であって、権利そのものではありません。",
      },
      {
        q: "他人の会員資格を使えますか。",
        a: "実際には使えません。認証は登録された氏名と生年月日を、あなたのチケッティングアカウントと本人確認書類に照合します。機能しないだけでなく、注文が取り消されるリスクもあります。",
      },
      {
        q: "先行は一般販売よりどれくらい早く始まりますか。",
        a: "ツアーによって異なります。1日以上前が一般的で、会員資格の締切はさらにその前にあります。確実な情報源は、あなたの公演の公式告知だけです。",
      },
    ],
    labels: JA_LABELS,
  },
  {
    locale: "ja",
    slug: "foreign-card-declined-korean-ticketing",
    sourceChecked: "2026-10-14",
    translated: "2026-10-20",
    review: "machine-assisted",
    title: "韓国のチケッティングサイトでカードが拒否される理由",
    summary:
      "同じ決済を拒否しうるシステムが三つあります——プラットフォーム、カードネットワーク、そしてあなたの銀行。対処はそれぞれ違い、速いのは一つだけです。",
    scope:
      "韓国のチケッティングプラットフォームにおける海外発行カードの決済を扱います。金融助言ではなく、あなたの銀行固有の規定までは扱えません。",
    intro: [
      "決済段階でのカード拒否は、K-POPのチケッティングで最も高くつく失敗です。確保された席は数分で在庫に戻るからです。そしてそのほとんどが、時間の余裕があれば防げます。",
      "ランダムに感じるのは、独立した三つのシステムが同じ取引を拒否しうるのに、表示されるエラーはどれが拒否したのかをほとんど教えてくれないからです。直すのにかかる時間の順に見ていってください。",
    ],
    steps: [
      {
        title: "アカウントの本人確認が本当に完了しているか確認する",
        body: "いくつかのプラットフォームでは、海外発行カードはアカウントが海外顧客として確認済みになってから初めて使えます。その確認がまだ保留中なら、カードがどれだけ健全でも失敗します。これがいちばん時間のかかる対処なので、最初に置いています。",
        pitfall:
          "決済エラーは「本人確認が保留中です」とは言いません。カードの問題のように見えます。",
        takes: "1〜3日",
      },
      {
        title: "販売後ではなく、販売前に銀行へ伝える",
        body: "海外利用とオンライン利用を有効にし、銀行が対応していれば金額帯と国を事前承認してください。見慣れない時間帯の韓国加盟店からの初回請求は、不正検知システムがブロックするまさにその特徴です。",
        pitfall:
          "自動の不正ブロックは、あなたの側では無音のことが多いです——SMSもアプリ通知もありません。知るのは加盟店側の一般的な拒否メッセージからだけです。",
        takes: "1日",
      },
      {
        title: "アプリ内ブラウザで決済の段に入らない",
        body: "3Dセキュアや銀行のワンタイムパスワードの流れは、SNSやメッセージアプリに組み込まれたブラウザの中で頻繁に壊れます。通常のモバイルまたはデスクトップのブラウザを使い、銀行の認証メッセージを同じ端末で受け取れるようにしておいてください。",
        pitfall:
          "リダイレクトは成功したように見えて、認証が静かに落ちることがあります。それは拒否として表示されます。",
        takes: "0分、正しくやるだけ",
      },
      {
        title: "本当に別系統の予備を用意する。同じ銀行の2枚目は予備ではない",
        body: "同じ発行会社の2枚目は、たいてい同じ理由で失敗します。別の発行会社、別のネットワーク、またはプラットフォームが対応する代替手段があればそれが、本当の予備です。海外向けの二つのプラットフォームは互いに逆のものを拒否するので、カードを疑う前に知っておく価値があります。NOL WorldはVISA、MasterCard、AMEX、JCB、UnionPayを受け付けますが、韓国外で発行されたものに限り、韓国発行のカードは一律で拒否します。YES24 Globalはそのうち二つで逆の扱いをし、韓国外で発行されたアメリカン・エキスプレスを除外し、UnionPayは全面的に除外します。一方で拒否されたカードが、他方では正しいカードであることがあります。",
        pitfall:
          "同じ銀行のカード2枚は、不正検知のルール上は1枚です。",
        takes: "準備に30分",
      },
      {
        title: "確定する前に通貨と金額を確認する",
        body: "KRWで課金されるのか換算後の金額で課金されるのかを読み、自分のカードの海外取引手数料を把握してください。換算によって自分で設定した上限を超えると、それも拒否の原因になります。",
        pitfall:
          "ダイナミック・カレンシー・コンバージョンは静かにコストを上乗せします。ウォンで払うほうが通常は安い選択です。",
        takes: "5分",
      },
    ],
    faq: [
      {
        q: "残高があるのにカードが拒否されたのはなぜですか。",
        a: "多いのは次の三つのどれかです。プラットフォームのアカウントで海外顧客の本人確認が終わっていない、銀行の不正検知が見慣れない海外加盟店をブロックした、または3Dセキュアの工程が失敗した——よくあるのはアプリ内ブラウザで実行された場合です。拒否メッセージはふつうこれらを区別しません。",
      },
      {
        q: "PayPalは使えますか。",
        a: "海外向けのプラットフォームの一部が、一部の公演で代替決済手段に対応しています。全体一律ではなくプラットフォームごと・公演ごとの設定なので、それを前提に計画する前に、公演ページに記載された決済手段を確認してください。",
      },
      {
        q: "ウォンで払うべきですか、自国通貨で払うべきですか。",
        a: "加盟店の通貨で払うほうが、決済ページに換算させるより一般に安くなります。ダイナミック・カレンシー・コンバージョンは上乗せを加えるからです。自分のカードの海外取引手数料は、どちらにしてもかかります。",
      },
    ],
    labels: JA_LABELS,
  },
  {
    locale: "ja",
    slug: "nol-world-queue-and-seat-selection",
    sourceChecked: "2026-10-20",
    translated: "2026-10-20",
    review: "machine-assisted",
    title: "NOL Worldの待機列と、順番がリセットされる条件",
    summary:
      "更新すると順番が消えます。2台目の端末は1つ目の番号を無効にします。座席は再読み込みなしで更新されます。すべてNOL World自身のFAQに書かれていて、すべてが人が反射的にやることと逆です。",
    scope:
      "販売中のNOL Worldの待機列、座席表、キャンセル待ちの挙動を扱います。会員登録と海外顧客の本人確認はそれ以前の話で、NOL Worldガイドで扱っています。ここにある内容はすべてNOL Worldの公開FAQからのものです。",
    intro: [
      "チケットの待機列で人が取る行動は、更新することと、固まっているかもしれないので2つ目のブラウザを開くことです。NOL Worldではそのどちらも、守ろうとしているものを失わせます。そしてプラットフォーム自身がヘルプページでそう書いています。",
      "ここは、どのガイドも扱っていない部分です。外からは分からないからです——パニックの最中に、90秒間、一度だけ見ることになります。",
    ],
    steps: [
      {
        title: "更新しない。更新は順番をリセットします",
        body: "NOL Worldは率直に述べています——待機列は飛ばせず、ページを更新すると待機列での順番はリセットされます。再確認でも再取得でもなく、リセットです。保持していた番号は最後尾に戻ります。",
        pitfall:
          "固まって見える待機列ページは、たいてい単に待機列ページです。「何かをしている」と感じられる唯一の行動が、すでに済ませた待機を無駄にする唯一の行動です。",
        takes: "待機列のあいだずっと",
      },
      {
        title: "1アカウントに1つの番号。2回目の取得は1つ目を消します",
        body: "待機番号はアカウントごとに1つしか受け取れません。2つ目のブラウザ、ノートPCと並べたスマホなど、複数を試すと、NOL Worldは最初に受け取った番号を無効にします。すでに待機中に別の端末からReserveを押すと、既存の待機列を維持するか新しく取り直すかを尋ねられ、新しくを選ぶとその端末で最初から待ち直すことになります。",
        pitfall:
          "予備の端末を開くのはファンコミュニティでもっとも一般的なチケッティング戦術ですが、ここでは何もしないより厳密に悪いです。表示される選択肢は二度目の機会を差し出しているのではなく、どちらを捨てるかを尋ねています。",
        takes: "我慢できれば0分",
      },
      {
        title: "待機番号はチケットではありません",
        body: "NOL Worldは、待機列での順番はチケットを保証しないとしています。在庫には限りがあり、チケットは順番に発行されるからです。待機列が決めるのは「いつ試せるか」であって、「自分の番が来たときに残っているか」ではありません。待機列はNOL Worldで予約できるすべての商品に適用され、人気商品だけではありません。",
        pitfall:
          "小さい待機番号を結果として読むこと。それは順番であり、自分の番が来る前に在庫が尽きていることはあります。",
        takes: "1分",
      },
      {
        title: "座席表の更新もやめる——自動で更新されます",
        body: "予約システムは、空席が再読み込みなしでリアルタイムに更新されるよう整えられています。他の利用者が確保した席は消え、キャンセルされた席は自動で戻ります。「この座席はすでに選択されています」と表示された場合、それは別の利用者がほぼ同時に同じ席を選んだという意味で、あなたのページが古いということではありません。",
        pitfall:
          "座席表の更新には、待機列の更新と同じ代償があります。古いチケッティングサイトで身についた習慣が、ここではちょうど間違った習慣です。",
        takes: "座席選択中",
      },
      {
        title: "売り切れ率が何を測っているかを読む",
        body: "売り切れ率が表示される場合、それは全席の90%以上が決済された後にのみ現れ、選択可能な席ではなく決済済みのチケットを数えています。残席数はそもそも表示されないことがあります——NOL Worldは主催者が決めるとし、人気商品では表示と実際に購入できる在庫の間に遅れがあるとしています。",
        pitfall:
          "売り切れ率をリアルタイムの在庫として扱うこと。90%という下限を持つ決済済みチケットの数字であり、実際との差がもっとも大きくなるのは、まさにあなたがいちばん気にする局面です。",
        takes: "1分",
      },
      {
        title: "キャンセル待ちの通知が来たら、6時間あります",
        body: "キャンセル待ちの席が空き、通知から6時間以内に決済が完了しない場合、予約は自動的に取り消されて返金され、機会は次の人へ移ります。6時間は十分に思えますが、通知が韓国の営業時間に届き、この文章を読む多くの人はその一部を寝て過ごすことを思い出すまでの話です。",
        pitfall:
          "自分の時間で午前3時に開く6時間の窓は、実質2時間の窓です。販売時刻を換算したのと同じやり方で、通知時刻も換算してください。",
        takes: "6時間以内",
      },
      {
        title: "あとから座席を変更できないことを知る",
        body: "予約が完了すると座席の変更はできません——唯一の経路はキャンセルして予約し直すことで、それは公演のキャンセル手数料と、その間に席を取られるリスクにさらされます。クーポンも同じです。決済後にクーポンは適用できず、使うには同じ席をキャンセルして予約し直すことになり、それに伴う手数料がかかります。",
        pitfall:
          "迷っている席を、あとで直すつもりで予約すること。あとはありません。",
        takes: "確定する前に",
      },
    ],
    faq: [
      {
        q: "更新するとNOL Worldの待機列が速く進みますか。",
        a: "逆です。NOL Worldは、ページを更新すると待機列での順番がリセットされるとし、待機列は飛ばせないとしています。",
      },
      {
        q: "スマホとノートPCで同時に待機できますか。",
        a: "できません。1アカウントが受け取る待機番号は1つで、追加で取ろうとすると最初の番号が無効になります。2台目の端末でReserveを押すと、既存の待機列を維持するか、その端末で最初からやり直すかを尋ねられます。",
      },
      {
        q: "新しい空席を見るには座席表を更新する必要がありますか。",
        a: "ありません。座席はリアルタイムで更新されます——確保された席は消え、キャンセルされた席は再読み込みなしで戻ります。更新の代償は待機列の更新と同じです。",
      },
      {
        q: "売り切れ率は実際に何を意味しますか。",
        a: "全席の90%以上が決済された場合にのみ表示され、選択できる席ではなく決済済みのチケットを数えています。人気公演では、その数字と実際の空き状況の間に既知の遅れがあります。",
      },
      {
        q: "キャンセル待ちの通知後、どれくらい時間がありますか。",
        a: "6時間です。その間に決済が完了しないと、予約は自動的に取り消されて返金され、席はキャンセル待ちの次の人へ移ります。",
      },
    ],
    labels: JA_LABELS,
  },
  {
    locale: "ja",
    slug: "nol-facepass-face-registration",
    sourceChecked: "2026-10-20",
    translated: "2026-10-20",
    review: "machine-assisted",
    title: "NOL facepass：顔を預けるのは誰か、そして何のためか",
    summary:
      "一度登録すれば、カメラがチケット確認なしで通してくれます。顔のデータはNOL Worldではなくトスが保管し、あとから変更はできません。そして解約すると写真は削除されますが、別の控えが1年間残ります。",
    scope:
      "NOL facepassについてNOL Worldが公開している内容を扱います——何をするものか、顔のデータを誰が保管するか、登録が何を確定させるか、そして解約後の保管期間として同社が示している内容。対応は公演ごとで、公演ページが判断の基準です。ここにあるものは、あなたの国の生体情報に関する法的見解ではありません。",
    intro: [
      "韓国の会場は入場の顔認証へ移りつつあり、海外のファンはそれを予約中のチェックボックスとして、英語の説明もほとんどないまま目にします。その下にある問いは小さくありません——取引したことのない会社が、これからあなたの顔を保持します。",
      "NOL Worldは回答を公開しています。具体的で、たいていの企業より誠実で、待機列の最中ではなくその前に読む価値があります——解約後にデータがどうなるかという回答も含めて。それは「削除」という一語から想像する内容とは違います。",
    ],
    steps: [
      {
        title: "何の代わりになるのかを理解する",
        body: "NOL Worldはfacepassを、入場時の本人確認にかかる手続きと時間を短縮する方法だと説明しています。顔の登録が完了すると、入口でカメラがスキャンし、チケット確認なしで入場できます。これはゲートでの書類確認の代わりであって、その上に乗る追加の層ではありません。",
        pitfall:
          "便利機能としてだけ読むこと。NOL World自身の説明の後半は取り締まりであり、それが次の段です。",
        takes: "2分",
      },
      {
        title: "もう一つの存在理由を知る",
        body: "NOL Worldは目的を二つ挙げています——本人確認の簡素化と、チケットの不正販売・流通の防止です。チケットを買ったアカウントと一致しなければならない顔は転売の管理装置であり、額面超の反復的な転売に及ぶ改正公演法と同じ時期に登場しています。この二つの事実は並べて置くべきものです。",
        pitfall:
          "転売サイトで買ったチケットがfacepassのゲートで通ると思い込むこと。このシステムは、まさにそれが通らないようにするために存在します。",
        takes: "2分",
      },
      {
        title: "顔が実際にどこへ行くのかを知る",
        body: "ここがもっとも知る価値のある部分です。NOL Worldは、顔の情報——元の画像と特徴データ——は暗号化されてトス（FaceAccessサービスを提供するフィンテック企業）が保管し、いかなる場合もNOL Worldや事務所には提供されないとしています。共有されるのは認証の結果、成功か失敗かだけです。NOL Worldはまた、データはサービス提供以外のいかなる目的にも使われないとし、トスがISO 27701とCBPRの認証を保持していることを挙げています。",
        pitfall:
          "これらはNOL Worldが第三者について述べた内容であり、監査結果ではありません。この種のページとしては異例に具体的で、それは真剣に受け取る理由にはなりますが、読むのをやめる理由にはなりません。",
        takes: "5分",
      },
      {
        title: "登録は恒久的なものとして扱う",
        body: "いったん登録した顔は変更できません。NOL Worldは理由を率直に述べています——サービスの不正利用を防ぐためです。あとから悪い登録をやり直す方法はないので、登録したときの条件がそのまま残る条件になります。照明、眼鏡、カメラが捉えたものすべてです。",
        pitfall:
          "待機列の中で、暗いところで急いで登録し、あとでちゃんとやり直すつもりでいること。あとはありません。",
        takes: "意図して10分",
      },
      {
        title: "自分のスマホやアカウントで他人に登録させない",
        body: "NOL Worldは直接述べています——他人にアカウントを使わせないようにしてください。そして、誰かがあなたのスマホやアカウントを使って顔情報を登録した場合、それによって生じる問題について同社は責任を負いません。ツアーの発売開始の瞬間に家族で共有している端末、というのはまさにこれが起きる経路で、結果を背負うのはアカウントです。",
        pitfall:
          "ログインしたままの自分のスマホで友人の登録を手伝うこと。あなたのアカウントに紐づいた顔はその友人のもので、変更はできず、免責は明示されています。",
        takes: "1分",
      },
      {
        title: "そもそも自分の公演が対応しているか確認する",
        body: "対応は全公演共通ではなく公演ごとです——NOL Worldは、ある公演がfacepassに対応しているかどうかの確認方法について専用の項目を設けており、それは答えが一定でないからこそ存在します。入場をそれ前提で計画する前に自分の公演のページを確認し、通常の経路も用意しておいてください——予約番号と身分証を持って会場窓口へ、です。",
        pitfall:
          "登録したのに、まだ書類確認をしている会場に、パスポートをホテルに置いて到着すること。",
        takes: "3分",
      },
      {
        title: "削除についての回答を注意して読む——単なる削除ではありません",
        body: "NOL Worldは、解約した場合に顔情報が削除されるかという問いに答えており、その答えは二つの半分からなります。前半——解約するとあなたの顔写真は削除され、再び使うには登録し直す必要があります。後半——本人確認の目的で、データは解約時点から1年間、別途保管されます。NOL Worldによれば、再登録時の本人確認にのみ使われ、1年後に破棄されます。つまり解約は、写真を削除して時計を始めるのであって、時計を止めるのではありません。これは擁護できる方針であり、そして「削除」という語だけから想像する内容ではありません。だからこそ、登録する前に彼ら自身の言葉で読む価値があります。",
        pitfall:
          "生体情報に何が起きるかについて、第三者の一語の要約を信じること——当サイトのものも含めて。見出しではなく、保管期間の一文を読んでください。",
        takes: "5分",
      },
    ],
    faq: [
      {
        q: "NOL Worldは私の顔を見るのですか。",
        a: "NOL Worldは見ないとしています。顔情報は暗号化されてトスが保持し、NOL Worldはそれがいかなる場合もNOL Worldや事務所に提供されることはないとしています——共有されるのは認証の成功・失敗だけです。",
      },
      {
        q: "最初の登録がうまくいかなかった場合、やり直せますか。",
        a: "できません。NOL Worldは、サービスの不正利用を防ぐため、登録した顔は変更できないとしています。一回目を意図して丁寧にやってください。",
      },
      {
        q: "facepassを解約したら顔のデータは削除されますか。",
        a: "一部は削除され、その後は期限付きで残ります。NOL Worldは、解約時に顔写真は削除され、再び使うには登録し直す必要があるとしています。また、本人確認の目的でデータは解約から1年間別途保管され、再登録する場合の本人確認にのみ使われ、その1年後に破棄されるとしています。2026年10月20日まで、このページには「その回答を読めていないので要約しない」と書かれていました。現在は上に引用し、当サイトの訂正記録にも記載しています。",
      },
      {
        q: "すべての公演がfacepassを使うのですか。",
        a: "いいえ。対応は公演によって異なり、NOL Worldは確認方法について別の回答を用意しています。自分の公演のページで確かめ、通常の受取経路も使える状態にしておいてください。",
      },
      {
        q: "自分のアカウントで他人が顔を登録してしまったらどうなりますか。",
        a: "NOL Worldは、それによって生じる問題について責任を負わないとし、他人にアカウントを使わせないよう求めています。登録した顔は変更できないため、これは通常の方法では回復できません。",
      },
    ],
    labels: JA_LABELS,
  },
  {
    locale: "ja",
    slug: "nol-world-cancel-ticket-refund",
    sourceChecked: "2026-10-20",
    translated: "2026-10-20",
    review: "machine-assisted",
    title: "NOL Worldのチケットをキャンセルする：締切、手数料、それでも減るお金",
    summary:
      "キャンセルの締切は韓国時間で公演の前日の午後、土曜公演は他の曜日より早く締まります。そして全額返金されても、海外カードの保有者はお金を失うことがあります。さらに——友人にチケットを送ると、キャンセルボタンが消えます。",
    scope:
      "NOL Worldで公演チケットをキャンセルする手順を、NOL Worldが公開している内容にもとづいて扱います——締切、手数料がどこに表示されるか、海外カードへの返金の流れ、そしてキャンセルを不可能にするもの。NOL Worldは手数料表を公開しておらず、このページも勝手に作りません。ツアー・アクティビティ商品は独自の規定に従い、違いがある箇所でのみ触れます。",
    intro: [
      "海外のファンは、国内のファンがめったに持たない理由でキャンセルします——ビザ、乗継便、変わった勤務シフト。ですからキャンセルの規定は、本来の想定読者よりこの読者層にとって重要です。そして規定は厳格で、時差に依存し、二か所で誰も予想しない形で非対称です。",
      "以下のうち二つは、予約したあとではなく予約する前に知っておく価値があります。土曜公演はキャンセルの締切が他のどの曜日より6時間早いこと。そして、NOL Worldが完全に処理したキャンセルでも、海外カードの保有者は手元が減りうること——これは誰のミスでもなく、誰かが直してくれる問題でもありません。",
    ],
    steps: [
      {
        title: "予約する前に締切を知る。公演当日ではありません",
        body: "NOL Worldは公演のキャンセルを当日ではなく前日に締め切ります——平日と祝日は公演前日の17時（KST）、土曜公演は前日の11時（KST）です。人がつまずくのは土曜の規定です。他の曜日より6時間早く、しかも土曜の公演に適用されるので、締切は韓国時間の金曜午前になります。",
        pitfall:
          "日本は韓国と同じUTC+9なので、KSTの表記をそのまま読めます——換算は要りません。だからこそ土曜の規定だけが残る落とし穴です。「前日」と読んで17時のつもりでいると、土曜公演では6時間前に締め切られています。",
        takes: "支払う前に5分",
      },
      {
        title: "迷っているなら無料の猶予を使う",
        body: "手数料のかからない期間があり、それは短いです。NOL Worldは、チケットについては予約日の23時59分までにキャンセルすれば手数料はかからないとしています。つまり無料で撤回できる判断は、予約したその日にする判断だけです。日付が変わればコストが発生します。",
        pitfall:
          "その23時59分を自分の深夜だと思い込むこと。NOL Worldは他のキャンセル締切ではKSTを明記していて、これだけ時間帯を書いていません。安全な読み方は韓国時間です——いずれにせよ、窓の最後の10分で下す判断は遅すぎる判断です。",
        takes: "—",
      },
      {
        title: "ボタンの場所と、無いときの意味を知る",
        body: "経路はアプリまたはウェブ、Account/My、My Reservations、Ticket Reservation List、該当の予約、そして詳細ページのCancel Reservationです。詳細ページにCancel Reservationボタンがそもそも無い場合、NOL Worldの指示は探し続けるのではなくカスタマーサポートに連絡することです。担当者が供給者にキャンセルの可否、手数料、返金額を確認したうえで案内します。申請の進行は予約詳細ページで追え、完了すると確認メールが届きます。",
        pitfall:
          "ボタンが無いことをサイトの不具合と読んで1時間やり直すこと。それは状態であり、やり直している間も最初の段の時計は動いています。",
        takes: "15分＋サポートの時間",
      },
      {
        title: "手数料表は無いものと考え、自分の予約から数字を取る",
        body: "計画の基準にできる公開された手数料表はありません。キャンセル手数料はいくらかと問われると、NOL Worldは経路で答えます——ウェブ/アプリ、Account/My、My Reservations、Reservation Details。その数字はプラットフォームの性質ではなく、あなたの予約の性質だからです。ツアー・アクティビティ商品では、Cancel Reservationを押した時点で、確定前に手数料と返金額が表示されます。あなたの予約と一致しないかもしれない割合を、ここに印刷するつもりはありません。",
        pitfall:
          "ブログ記事の手数料表を前提に計画すること。あなたの公演について韓国のキャンセル料率を固定の数字で書いているガイドは、NOL Worldが公開していない数字を書いています。",
        takes: "5分",
      },
      {
        title: "部分キャンセルは、まだ予約している最中に確認する",
        body: "4枚のうち2枚だけキャンセルできるかは公演によって可否が分かれ、NOL Worldの指示は予約している最中に部分キャンセルの可否を確認することです——つまり、それが必要になる前に、ということです。ツアー・アクティビティ商品ではそもそも認められません。そこでの経路は予約全体をキャンセルして取り直すことで、NOL Worldはそのあと在庫が保証されず、取り直せない場合があると明言しています。",
        pitfall:
          "来られるか微妙な友人2人をあとで外せる前提で4枚取ること。部分キャンセル不可の公演では、選択肢は4枚全部かゼロかになります。",
        takes: "予約時に2分",
      },
      {
        title: "全額返金でも海外カードの保有者はお金を失いうると理解する",
        body: "ここはこの読者層のために書かれた部分で、英語でもほとんど説明されていません。NOL Worldは、海外のクレジットカードを使った場合、予約日のレートとキャンセル日のレートの差によって為替差益または差損が生じうるとし、さらに別途、取引がキャンセルされていても海外取引手数料が適用されることがあるとしています。どちらもNOL Worldが差し引くものではありません。どちらもあなたのカード発行会社であり、NOL Worldの案内は正確なレートと手数料を発行会社に問い合わせることです。",
        pitfall:
          "請求額より少ない返金額を、エラーや隠れた手数料として読むこと。その差は二つの日付の間で動いた為替レートでありえます。そして説明できるのはチケッティングのプラットフォームではなく、あなたの銀行です。",
        takes: "銀行へ電話1本",
      },
      {
        title: "カードネットワークに必要な時間を与える",
        body: "取引がまだカード会社へ渡っていなければ、NOL Worldはキャンセルは即座に完了するとしています。すでに渡っていて決済額が確定している場合は、カード会社が取消処理をするのにおおよそ5〜7日、そしてキャンセル分は返金としてではなく翌月の請求から差し引かれると見込んでください。NOL Worldは返金の扱いがカード会社によって異なるとしているので、タイミングについての権威はあなたのカード会社です。",
        pitfall:
          "取消処理が進行中に銀行へ異議申立てを出すこと。すでにキャンセルされつつある取引へのチャージバックは、今後も使いたいアカウントに二つ目の問題を作ります。",
        takes: "5〜7日",
      },
      {
        title: "行くと確信するまでモバイルチケットを送らない",
        body: "これがこのページ全体に値する落とし穴です。モバイルチケットの共有は購入者が来場者へチケットを送れる機能で——NOL Worldは、チケットの送信が成功すると予約のキャンセルが制限されるとしています。戻す手段は受け取った側にあります。相手が登録を解除すれば、再びキャンセルできるようになります。登録前であればもう少し柔らかい出口があります——未登録のあいだは送信者がCancel Sendを押せますし、未登録のチケットは24時間後、または観覧日までに自動で戻ります。",
        pitfall:
          "予約した週に、段取りの良い行動として友人へチケットを送ること。キャンセルボタンは事実上その人のものになり、取り戻すには先にチケットを手放してもらう必要があります。",
        takes: "—",
      },
      {
        title: "ツアー・アクティビティの規定は別に読む",
        body: "予約が公演チケットではなくツアー、送迎、アクティビティの場合、ここまでのどれも安全な初期値ではありません。NOL Worldは、これらの商品の一部は購入後いっさいキャンセルできず、購入当日であっても100%のキャンセル手数料が適用される場合があるとしています。適用されるのは商品自体の詳細ページとバウチャーに記載された規定で、NOL Worldはキャンセル申請の前にそれを読むよう求めています。",
        pitfall:
          "同じ買い物の流れで予約したパッケージに、チケットの規定を持ち込むこと。当日無料の猶予は公演チケットの規定であり、ツアー商品は支払った瞬間から返金不可でありえます。",
        takes: "商品ごとに10分",
      },
    ],
    faq: [
      {
        q: "公演のキャンセル締切は正確にいつですか。",
        a: "韓国時間で公演の前日です。NOL Worldは、平日と祝日は前日の17時（KST）、土曜公演は前日の11時（KST）としています。日本は韓国と同じUTC+9なので時刻はそのまま読めますが、土曜だけ6時間早いことに注意してください。",
      },
      {
        q: "無料でキャンセルできる場合はありますか。",
        a: "公演チケットについては、予約した当日ならあります。NOL Worldは、予約日の23時59分までのキャンセルには手数料がかからないとしています。他の締切ではKSTを明記しているのにこれだけ時間帯を書いていないので、韓国時間として扱い、ぎりぎりを狙わないでください。ツアー・アクティビティ商品は別で、当日でも100%かかるものがあります。",
      },
      {
        q: "キャンセル手数料はいくらですか。",
        a: "NOL Worldは手数料表を公開していません。その質問には経路で答えます——ウェブまたはアプリ、Account/My、My Reservations、Reservation Details。数字はあなたの予約に属するからです。ツアー・アクティビティ商品では、Cancel Reservationを押すと確定前に手数料と返金額が表示されます。あなたの公演について固定の割合を書いている英語ガイドは、プラットフォームが述べていない数字を書いています。",
      },
      {
        q: "期限内にキャンセルしたのに、支払った額より少なく戻ってきました。差額はどこへ行ったのですか。",
        a: "おそらくNOL Worldではありません。NOL Worldは、海外カードでは予約日とキャンセル日のレートの差によって為替差益・差損が生じうるとし、取引がキャンセルされていても海外取引手数料が適用されることがあるとしています。どちらもカード発行会社の側にあり、NOL World自身の案内も、正確なレートと手数料は発行会社に尋ねることです。",
      },
      {
        q: "お金が戻るまでどれくらいかかりますか。",
        a: "取引がまだカード会社に届いていなければ、キャンセルは即座に完了します。届いている場合、NOL Worldはカード会社が取消処理をするのにおよそ5〜7日かかり、その分は翌月の請求から差し引かれるとしています。カード会社によって異なるので、答えられるのはあなたのカード会社です。",
      },
      {
        q: "モバイルチケットをすでに友人へ送りました。まだキャンセルできますか。",
        a: "相手が持っているあいだはできません。NOL Worldは、モバイルチケットの送信が成功すると予約のキャンセルが制限され、受け取った側が登録を解除すれば再び可能になるとしています。まだ登録されていなければ、もっと簡単な出口があります——送信者がCancel Sendを押せますし、未登録のチケットは24時間後または観覧日までに自動で戻ります。",
      },
      {
        q: "4席のうち2席だけキャンセルできますか。",
        a: "公演によります。NOL Worldの案内は、必要になったときではなく予約するときに部分キャンセルの可否を確認することです。ツアー・アクティビティ商品では部分キャンセルは一切できません——全体をキャンセルして取り直すことになり、在庫が残っている保証はありません。",
      },
      {
        q: "予約ページにCancel Reservationボタンがありません。",
        a: "NOL Worldはそれを、やり直すべき不具合ではなくカスタマーサポートの案件として扱っています。担当者がまず可否、手数料、返金額を供給者に確認します。待っている間も最初の答えにある締切は動いているので、早めに連絡してください。",
      },
    ],
    labels: JA_LABELS,
  },
  {
    locale: "ja",
    slug: "weverse-membership-renewal-overseas",
    sourceChecked: "2026-10-20",
    translated: "2026-10-20",
    review: "machine-assisted",
    title: "海外からのWeverse会員資格の更新",
    summary:
      "自動決済は有効期間の最終日、最初に支払ったのと同じ時刻に実行されます。通貨は一致していなければならず、更新期間を過ぎて失敗した場合、買い直す以外の戻る道はありません。",
    scope:
      "すでに持っているWeverse公式メンバーシップを維持することと、失効した場合の代償を扱います。初めてファンクラブに入ることや、特定の先行販売の資格を満たすことは別の話で、先行販売ガイドで扱っています。ここにある内容はすべて、Weverse Shopの2026年9月3日の公知と、そこから参照される商品ページによります。",
    intro: [
      "悪い週に失効した会員資格が失わせるのは、サブスクリプションではありません。先行販売です。資格は締切より前に有効だった会員資格に対して確認され、あとから買い直しても、その日付は動きません。",
      "Weverseは2026年9月3日に自動決済を追加し、通常の失効経路をなくしました。同時に、間違えやすい四つの規定と、一つの引き返せない地点が持ち込まれました。",
    ],
    steps: [
      {
        title: "自分がどの会員カテゴリにいるかを調べる",
        body: "Weverseは会員資格を三つのカテゴリ——Global、Japan、USA——で運用しており、それぞれ別に管理されます。決済手段、通貨、自動決済の設定はすべてカテゴリごとで、各カテゴリに最大5件の決済手段を保存でき、うち1件を主たる手段に指定します。自分がどのカテゴリにいるかは気軽に選ぶものではありません。すでに会員資格が存在している場所です。",
        pitfall:
          "使っていないほうのカテゴリで自動決済を設定すること。画面は同じに見えますが、更新されるのはもう一方の会員資格です。",
        takes: "5分",
      },
      {
        title: "自分の通貨がそのカテゴリで実際に使えるか確認する",
        body: "2026年9月3日時点では、Global Membershipは韓国のデビット／クレジットカードでKRW、PayPalに登録したカードでJPY、USD、MXNを受け付けます。Japan Membershipはクレジットカードで円。US MembershipはPayPalに登録したカードで米ドルです。日本の読者にとって実務上重要なのはここです——Global MembershipをJPYで払う場合、カードはPayPal経由になります。直接カードを登録する選択肢はありません。",
        pitfall:
          "USDやJPYのGlobal MembershipにVisaを直接登録できると考えること。同じ仕組みがWeverse Shop全体を貫いていて、他のどこでも使えるカードがここで通らない理由はそれです。",
        takes: "10分",
      },
      {
        title: "購入時の通貨と主たる決済手段の通貨を一致させる",
        body: "Weverseは直接こう述べています——メンバーシップの購入に使った決済通貨は、自動決済の主たる手段の決済通貨と一致していなければなりません。不一致は更新のタイミングであなたに有利に解決されることはありません。更新が通らない、という結果になります。",
        pitfall:
          "ある通貨で会員資格を買い、あとから別の通貨の手段を主たる手段に設定すること。どちらの画面でも問題なく見えて、効く日にだけ失敗します。",
        takes: "3分",
      },
      {
        title: "更新される正確な瞬間を知る",
        body: "自動決済は現在の会員資格の有効期間の最終日、最初に購入したのと同じ時刻に実行されます。その時刻は韓国のサーバー基準で設定されました。日本は韓国と同じUTC+9なので時刻はそのまま読めますが、最初に買った時刻が深夜なら更新も深夜です。失敗した場合、Weverseはメールとプッシュ通知を送り、更新期間が続くかぎり毎日同じ時刻に再試行します。",
        pitfall:
          "期間の途中で期限切れになるカードや、請求をブロックする銀行は、深夜に届く通知に変わります。再試行は1時間ごとではなく1日ごとです——メールを見なかった1日は、窓を1日分使った日です。",
        takes: "2分",
      },
      {
        title: "自動決済の解除が「しないこと」を理解する",
        body: "自動決済の解除は、以後の更新を止めます。すでに持っている会員資格を解約したり返金したりはせず、有効期間が終わるまで通常どおり使えます。会員資格そのものの解約と返金は別の話で、その会員資格の商品ページの規定に従います。",
        pitfall:
          "返金を期待して自動決済を解除すること。そしてもう一つ——ツアーの噂が出ている時期に「一時停止」のつもりで解除すること。更新が止まってほしくない週はまさにその週です。",
        takes: "2分",
      },
      {
        title: "更新期間の終わりを、引き返せない地点として扱う",
        body: "自動決済を解除した場合、再開できます——ただし更新期間がまだ続いているあいだだけです。その期間が終わると再開はできず、唯一の経路は会員資格を買い直すことになります。Weverseは期間内に手動の操作も二つ用意しています——即時に更新するPay Nowと、決済手段を直したあとに使うRetry Nowです。",
        pitfall:
          "再試行が成功するかどうかを待って見ていること。Retry NowとPay Nowはまさに待たなくていいように存在していて、どちらも窓が閉じると消えます。",
        takes: "5分",
      },
      {
        title: "買い直すのではなく更新する。記録が引き継がれるからです",
        body: "自動決済で会員資格が更新されると、既存の会員資格に登録されている会員情報が次の会員資格に引き継がれます。その記録——とりわけそこにある氏名——が、先行販売の資格確認で照合される対象です。失効後に新しく会員資格を買うと、新しい記録と新しい開始日から始まります。サブスクリプション料金ではなく先行販売を失わせるのは、その部分です。",
        pitfall:
          "継続を「忠誠度」の話だと考えること。これは記録の上の日付と氏名の話で、そのどちらかに空白があることが、確認の目に映るものです。",
        takes: "2分",
      },
    ],
    faq: [
      {
        q: "Global Membershipを自分のVisaやMastercardで払えますか。",
        a: "KRW以外では直接は払えません。Global Membershipは韓国のカードでKRW、PayPalに登録したカードでJPY、USD、MXNを受け付けます——つまりあなたのカードは、直接のカード決済ではなくPayPal経由でWeverseに届きます。",
      },
      {
        q: "自動決済はいつ課金されますか。",
        a: "現在の会員資格の有効期間の最終日、最初に支払ったのと同じ時刻です。その時刻は韓国の時計で設定されました。日本は同じUTC+9なので換算は不要ですが、最初の購入が深夜だったなら更新も深夜です。",
      },
      {
        q: "自動決済が失敗したら、何回まで機会がありますか。",
        a: "Weverseはメールとプッシュで通知し、以後は更新期間が残っているあいだ、毎日同じ時刻に1回ずつ再試行します。決済手段を直したあとにRetry Nowを使うことも、Pay Nowで即座に更新することもできます。",
      },
      {
        q: "自動決済を解除しました。元に戻せますか。",
        a: "更新期間がまだ開いているあいだなら戻せます——そのためのReactivateの操作があります。更新期間が終わるとできなくなり、選択肢は会員資格を買い直すことだけになります。",
      },
      {
        q: "会員資格が数日間切れていても問題になりますか。",
        a: "価格より大きな問題になりえます。更新は既存の会員資格の会員情報を引き継ぎますが、買い直しは新しい日付で新しい記録を始めます。先行販売の資格は、ファン歴の長さではなく、その記録とその締切に対して確認されます。",
      },
    ],
    labels: JA_LABELS,
  },
  {
    locale: "ja",
    slug: "nol-world-account-recovery-and-booking-errors",
    sourceChecked: "2026-10-20",
    translated: "2026-10-20",
    review: "machine-assisted",
    title: "NOL Worldに入れない：アカウントの探し方と、開かないページの直し方",
    summary:
      "どのログイン方法を使ったかが、復旧のすべての経路を決めます。パスワード再設定はメール登録にしか存在せず、メール認証をしていないアカウントはそもそも見つけられないことがあります。そして、エラーではないエラー表示について。",
    scope:
      "アカウントの復旧と退会、そしてNOL Worldが文書化している予約ページの不具合——ブラウザとアプリの要件、モバイルの座席表、不具合に見えるポップアップ——を扱います。待機列の仕組みは専用のガイドにあります。ここには、自分のものでないアカウントに入る方法は一切ありません。",
    intro: [
      "チケットサイトでは、チケットとは無関係に起きる問題が二つあります。アカウントに入れない。あるいはページが本来の動作をしない。どちらも販売当日の朝に起き、そのときは何かを読んでいる時間がありません。",
      "そしてそのほとんどが、何か月も前に何も考えずに下した一つの選択で決まります——メールアドレスで登録したか、Google・Apple・LINEで登録したか。この一点が、そもそもパスワード再設定が自分に存在するかどうかを決めるので、ここから始めます。",
    ],
    steps: [
      {
        title: "自分がどのログイン方式なのかを調べる",
        body: "NOL Worldのアカウントは、メールアドレスで作るか、ソーシャルログイン——Google、Apple、LINEなど——で作られます。その帰結は思うより鋭いものです。NOL Worldは、パスワードの復旧はメールアドレスで登録した利用者にのみ利用可能だと述べています。ソーシャルログインを使ったなら、再設定すべきNOL Worldのパスワードは存在しません。最初から無かったからです。急いでいない今のうちに、自分がどちらかを確かめてください。",
        pitfall:
          "メールアドレスを入力した記憶があるからメール登録だと思い込むこと。ソーシャルログインでもメールアドレスは表示されますし、復旧の経路はまったく別です。",
        takes: "5分",
      },
      {
        title: "メール認証を済ませる。これだけは取り返しがつきません",
        body: "アカウント復旧についてNOL Worldが最後に添えている一文が、この領域でもっとも重要です——メール認証を行っていないアカウントは見つけることが難しい場合があります。ほかはすべて、結果のある手続きです。これだけは、開かないかもしれない扉です。サポートはあなたを記録に照合しているのであり、認証済みのメールアドレスは彼らが持つ最も強い照合点です。いま動いているアカウントでこれを読んでいるなら、そのメールアドレスが認証済みであることを確認し、認証済みのままにしておいてください。",
        pitfall:
          "販売に間に合わせようと急いで、登録時の認証メールを飛ばすこと。その日のコストはゼロで、それが復旧できるアカウントと失われたアカウントの分かれ目になります。",
        takes: "いま3分",
      },
      {
        title: "ソーシャルログインなら、まず提供元の側を見る",
        body: "NOL Worldのアカウントを作ったかどうか自体が思い出せないなら、提供元が知っています。NOL Worldは確認場所を公開しています。Googleなら、Googleアカウント → セキュリティ → サードパーティ製のアプリとサービスとの接続。Appleなら、設定 → 自分の名前（Apple ID）→ サインインとセキュリティ → Appleでサインイン。LINEなら、設定 → アカウント → 連動アプリ。そこにNOL Worldが出ていれば、アカウントは存在し、どの提供元で開くかも分かります。",
        pitfall:
          "ログイン画面でソーシャルのボタンを片っ端から押して、どれが通るか試すこと。それは最初のアカウントを見つけるのではなく、二つ目を作ることになりえます。そして今、二つのうち一方にあなたの予約が入っています。",
        takes: "10分",
      },
      {
        title: "それでも駄目なら、サポートが求める5点を送る",
        body: "NOL Worldはアカウントを探してくれます。そして必要なものを明記しています——使った可能性のあるメールアドレス、ログイン方式（Google／LINE／Apple／メール）、ニックネーム、予約した商品の種類と予約番号です。最後の一つの在処も教えています——予約番号は、予約時に送られたメールのバウチャーにあります。書く前に全部そろえてください。予約番号が欠けた依頼は、推測してくださいという依頼です。",
        pitfall:
          "古い予約確認メールを不要なものとして削除すること。そこに予約番号があり、アカウント自体を失ったときに差し出せる最も強い識別材料です。",
        takes: "20分",
      },
      {
        title: "新しいスマホは予約を失わせません。別アカウントが失わせます",
        body: "これがもっとも多い誤警報で、NOL Worldははっきり答えています——スマホを変えても、ログインし直しても、履歴は消えません。確認するよう求めているのは、もともと使っていたのとは別のアカウントでログインしていないかどうかです。ほぼ常にそれが本当の原因で、理由はソーシャルログインです。新しい端末はいちばん都合のよい提供元を提示してきて、違うほうを押すと、空だけれど完全に有効な二つ目のアカウントに入ります。",
        pitfall:
          "予約が消えたと判断して買い直すこと。チケットはもう一方のアカウントにあり、二度目の購入は本物の購入です。",
        takes: "5分",
      },
      {
        title: "予約ページが想定しているブラウザを使い、公式の窓口だけを使う",
        body: "NOL Worldは、ウェブ標準に沿って作っているとし、PCでもモバイルでもGoogle ChromeかMicrosoft Edgeを推奨しています。予約ウィンドウが開かない場合の指示は具体的です——ブラウザを最新版に更新し、キャッシュを削除して、もう一度試す。アプリならApp StoreかGoogle Playで最新版に更新する。そして、そもそもチケットを買える場所も明記しています——NOL Worldのウェブサイト world.nol.com/ticket と NOL Worldアプリ、それ以外にはありません。",
        pitfall:
          "もともと対応していないブラウザで、SNSのリンクから開いたアプリ内ブラウザの中でトラブルシュートすること。サイトが壊れていると結論する前に、ChromeかEdgeで直接予約ページを開いてください。",
        takes: "前日に15分",
      },
      {
        title: "モバイルウェブで座席表が操作できないなら、アプリに切り替える",
        body: "これは一般的な不具合ではなく、文書化された端末固有の問題です。NOL Worldは、一部の端末ではモバイルウェブ環境で拡大・縮小するとブラウザ全体が拡大してしまい、座席選択ができなくなるとし、その回避経路はNOL Worldアプリをダウンロードすることだとしています。現時点で確認された端末として挙げているのは Galaxy Fold です。折りたたみや特殊な縦横比の画面を使っているなら、7分の決済枠の中で気づくのではなく、販売前にアプリを入れておいてください。",
        pitfall:
          "特定の席を探そうとして座席表をピンチで拡大すること。該当する端末では、その操作こそが選択を壊します。",
        takes: "事前に10分",
      },
      {
        title: "どのポップアップが不具合ではないかを知る",
        body: "エラーのように読めて、エラーではない表示が二つあります。NOL Worldは、「この座席はすでに選択されています」のポップアップは、ほぼ同時に別の利用者が同じ席を選んだときに表示されるとしています——あなたのセッションに問題があるのではなく、誰かが1秒速かっただけです。そして、空席は再読み込みなしで自動更新されるとしているので、固まって見える座席表はたいてい正常に動いている座席表です。どちらも、直すものではなく情報として扱ってください。",
        pitfall:
          "ポップアップを消すためにページを再読み込みすること。待機列のある販売では、それが順番を失わせる唯一の操作です。",
        takes: "—",
      },
      {
        title: "複数タブの案内は、不正防止ポリシーと併せて読む",
        body: "NOL Worldはアカウントごとに1台を求め、同一アカウントでの複数端末からの同時接続は予約が制限される可能性があるとしています。そのうえで、同時に予約を試みる人向けの技術的な案内——複数タブはセッションの競合を起こすので、ChromeとEdgeのようにまったく別のブラウザか、別の端末を使うこと——を示しています。これは注意して読む必要があります。同社自身の不正防止ポリシーは、同一または類似の個人情報で複数アカウントにまたがって予約することを不正利用として挙げているからです。この案内の安全な読み方は、別々のプラットフォームについての話だ、というものです——片方のブラウザでNOL World、もう片方で別のチケットサイト。自分のアカウントをいくつも同時に動かしてよいという許可ではありません。",
        pitfall:
          "セッション競合の技術的な助言を、複数アカウント運用のお墨付きとして受け取ること。二つのページは据わりが悪く、罰則が公開されているのは不正防止ポリシーのほうです。",
        takes: "5分",
      },
      {
        title: "退会するなら、何が消えて何が残るかを正確に知る",
        body: "退会は取り消せず、NOL Worldは項目を明記しています。削除されるもの——アカウントとプロフィール情報、予約履歴、旅程、お気に入りの場所の一覧。保持されるもの——あなたが場所に残したレビューと写真です。ウェブではどのログイン方式でも退会できます。アプリでメールログインなら、My Account、設定、Delete Account、そしてパスワード。ソーシャルログインなら同じ経路で、Google・LINE・Appleの認証を通します。同社の他の文書にある二つの事実も、ここに並べておく価値があります——退会は本人確認も消して別のアカウントで使えるようにすること、そして不正利用で制限されたアカウントはそもそも退会できないことです。",
        pitfall:
          "アカウントの問題を解消するために退会すること。制限されたアカウントは退会できませんし、確認済みのアカウントは本人確認も道連れにします——予約履歴は消えて、レビューは消えません。",
        takes: "—",
      },
    ],
    faq: [
      {
        q: "パスワードを忘れました。どう再設定しますか。",
        a: "メールアドレスで登録した場合に限ります——NOL Worldは、パスワードの復旧はメール登録の利用者にのみ利用可能だとしています。経路はログイン画面のFind Password、登録に使ったメールアドレスを入力、届いた再設定リンクをたどる、です。Google・Apple・LINEを使った場合、NOL Worldのパスワードは存在せず、提供元経由でサインインします。",
      },
      {
        q: "どのアカウントを使ったのかも分かりません。",
        a: "まず提供元の側を確認してください。NOL Worldが経路を公開しています——Googleアカウント → セキュリティ → サードパーティ製のアプリとサービスとの接続、Appleの設定 → Apple ID → サインインとセキュリティ → Appleでサインイン、LINEの設定 → アカウント → 連動アプリ。NOL Worldが出てくれば、それがそのアカウントです。",
      },
      {
        q: "どれも駄目でした。サポートは見つけてくれますか。",
        a: "渡した情報をもとに探してくれます——使った可能性のあるメールアドレス、ログイン方式、ニックネーム、予約した商品の種類と予約番号。予約番号は、NOL Worldによれば予約時に送られたメールのバウチャーにあります。そして、メール認証をしていないアカウントは見つけるのが難しい場合があるとも警告しているので、持っている情報はすべて送ってください。",
      },
      {
        q: "スマホを変えたら予約が消えました。",
        a: "ほぼ確実に消えていません。NOL Worldは、スマホの変更や再ログインで履歴は消えないとし、もともと使っていたのと別のアカウントでログインしていないか確認するよう求めています。ソーシャルログインでは簡単に起きます——新しい端末が提示するのは、いちばん都合のよい提供元であって、あなたが使った提供元とは限りません。",
      },
      {
        q: "予約ウィンドウがまったく開きません。",
        a: "NOL World自身の手順はこうです。標準的なブラウザを使う（ChromeとEdgeを挙げています）、最新版に更新する、キャッシュを削除する、もう一度試す。アプリならApp StoreかGoogle Playで最新版に更新する。またチケットを買えるのは world.nol.com/ticket とNOL Worldアプリだけだとしています。",
      },
      {
        q: "スマホのブラウザで座席が選べません。",
        a: "既知の端末問題があります。NOL Worldは、一部の端末では拡大・縮小するとモバイルブラウザ全体が拡大し、座席選択ができなくなるとし、対処はNOL Worldアプリを使うことだとしています。確認済みの端末として挙げているのは Galaxy Fold です。販売の最中ではなく、事前にアプリを入れておいてください。",
      },
      {
        q: "当選確率を上げるためにタブを二つ開いてもいいですか。",
        a: "いけません。NOL Worldはアカウントごとに1台を求めており、同一アカウントでの複数端末からの同時接続は予約が制限される可能性があるとしています。別ブラウザについての案内は、本当に二つの異なるチケットサイトを使う場合のセッション競合の話であって、自分のアカウントを複数動かすことの是認ではありません。類似の個人情報で複数アカウントにまたがって予約することは、同社が公開する不正利用の一覧に載っています。",
      },
      {
        q: "退会したらデータはどうなりますか。",
        a: "NOL Worldは退会は取り消せないとし、消えるものを列挙しています——アカウントとプロフィール情報、予約履歴、旅程、お気に入りの一覧。場所に残したレビューと写真は保持されます。別の箇所では、退会は本人確認も消して別のアカウントで使えるようにすること、そして不正利用で制限されたアカウントは退会できないことも述べています。",
      },
    ],
    labels: JA_LABELS,
  },
  {
    locale: "ja",
    slug: "weverse-data-leak-what-to-do",
    sourceChecked: "2026-10-20",
    translated: "2026-10-20",
    review: "machine-assisted",
    title: "Weverseの個人情報流出：実際に漏れたものと、それが生む一つのリスク",
    summary:
      "422,584件、Weverse自身が確認しました。氏名も連絡先もカード番号も含まれていません——内部識別番号と、あなたの購買履歴です。この組み合わせは口座を空にするためのものではなく、「あなたが何を買ったかを知っている」メッセージの材料です。",
    scope:
      "Weverseカンパニーが2026年9月に確認した流出について公開した内容を、英語版と韓国語版の両方で読んだうえで扱います。当サイトはセキュリティの監査者ではなく、これは法的助言でもありません。Weverseに帰属させた記述はすべて同社自身の説明であり、当サイトが検証した事実ではありません。セキュリティの件は進展しうるので、このページには最後に確認した日付を付けています。",
    intro: [
      "2026年9月、Weverseカンパニーの代表が、顧客の個人情報が流出したことを確認する公知を出しました。このサイトの読者は全員Weverseのアカウントを持っているので、問うべきは「重要かどうか」ではなく「実際に何が変わるのか」です。そして答えは、肩をすくめることともパニックとも違って、もっと狭く、もっと具体的です。",
      "以下は、その公知を、公開された二つの言語で丁寧に読んだものです。有用なのは件数ではありません。流出した特定の組み合わせが、あなたから盗むにはほとんど役に立たず、あなたを納得させるには異様に向いている、という点です。",
    ],
    steps: [
      {
        title: "二つのリストを読む。その違いがすべてを決めます",
        body: "Weverseは漏れたものを二つの見出しで列挙しています。個人情報項目として——内部識別情報、つまり登録時に利用者識別のために内部で生成される番号値。個人情報に該当しない一般情報項目として——購買タイプ（決済手段）、決済PG名、通貨形態、購買金額、取消金額、購買日時、購買状態、そして取り消された場合の返金日時。規模はアカウントID単位で422,584件です。どちらのリストにも無いものが要点です——氏名も、連絡先も、カード番号や決済の認証情報もありません。",
        pitfall:
          "422,584という数字を読んで、残りを他の流出事件の記憶で埋めること。認証情報の流出への対応とこれへの対応は違うので、見出しより項目の一覧のほうが価値があります。",
        takes: "5分",
      },
      {
        title: "Weverseの説明を公平に量る。限界も含めて",
        body: "Weverseは、流出した内部識別情報は氏名や連絡先のように個人を直接識別する情報ではなく、同社の内部システムでのみ使われる識別値で外部では使用できないとし、これらの項目だけでは決済の偽造や不正送金は起こりにくいとしています。額面どおりに見て、この論理は成り立っています——内部の行番号は身元ではなく、ここにある項目はどれも認証情報ではありません。正直な限界はこうです。内部識別子は、それを含む別のデータセットと結合された瞬間に識別可能になります。そしてその可能性の大きさを、社外の誰も測れません。残るリスクはそこです——盗難ではなく、突き合わせです。",
        pitfall:
          "妥当な説明を保証として扱うこと、あるいは言い訳として扱うこと。これは特定の項目についての特定の主張であり、狭いからこそ強いのです。",
        takes: "5分",
      },
      {
        title: "本当のリスクを理解する：あなたが何を買ったかを知っているメッセージ",
        body: "漏れた項目を並べて見てください——決済手段、PG名、通貨、金額、日時、状態、返金日時。これはあなたのカードに課金するための道具ではありません。ほとんどの人が不審なメールに対して適用する唯一の検証、すなわち「送り主が実在する注文の実在する情報を知っているか」を通過するメッセージを書くための道具です。実際の購入金額を、実際の日付で、実際の通貨で、実際の決済事業者を挙げて書かれた連絡は、無差別の詐欺が作れるどんな文面よりはるかに説得力があります。",
        pitfall:
          "「私の注文内容を知っている」を、そのメッセージが本物である証拠として使うこと。この流出以降その検証は機能しなくなり、そしてそれはほぼ全員が使っている検証です。",
        takes: "5分",
      },
      {
        title: "なぜこれが実在の手続きの上に乗るのかを知る",
        body: "これはたいていの読者層より、この読者層にとって重要です。Weverseの顧客には、すでに見知らぬ正規の相手がお金を要求してくるからです。Weverse ShopはEUの購入者に対し、現地の税関や配送業者から別途支払いの案内を受け取る場合があり、支払わないと配送が遅れたり届かなかったりすると警告しています。つまり本物の体験と詐欺の体験が、いま同じ見た目になります——取引したことのない会社が、あなたが実際に出した注文に言及し、荷物が動く前に支払いを求めてくる。流出がその重なりを作ったのではありませんが、鋭くしました。",
        pitfall:
          "その曖昧さを、払うことで解決すること、あるいは全部無視することで解決すること。前者はお金を失い、後者は荷物を失います。",
        takes: "—",
      },
      {
        title: "メッセージが何を知っているかに依存しない確認方法を使う",
        body: "抜け道は、メッセージを評価するのをやめて、主張のほうを評価することです。そこから追跡番号か注文番号だけを取り出し、配送業者かWeverse Shopに自分で行ってください——アドレスを打つか保存したブックマークから、決してメッセージ内のリンクからではなく——そしてその番号が自分の注文と一致するか、本当に未払いがあるかを見ます。本物なら、同じ情報が向こう側にもあります。本物でないなら何もなく、あなたは何もクリックせずにそれを知ったことになります。",
        pitfall:
          "情報が合っていたからリンクをたどること。情報が合っていることは、いまや偽物の標準状態です。",
        takes: "1通につき5分",
      },
      {
        title: "パスワード変更を対処だと取り違えない",
        body: "どんな流出でも反射的にパスワードを変えたくなりますが、ここではほとんど何も解決しません。漏れたのは決済情報処理APIを通じた識別子と購買メタデータであって、ログインの認証情報ではありません。パスワードの変更は費用も害もないので、気持ちが落ち着くならやってください——ただし、それが治療ではなく衛生であること、そして実際にあなたを守るのは前の段の確認の習慣であることを分かったうえで。ログイン提供元に二要素認証があるなら有効にしておく価値はありますが、それもこの流出への対応ではありません。",
        pitfall:
          "パスワードを変えて終わった気になり、次に注文内容を言い当てるメッセージを信じること。反射的な助言は心地よく、そして機能する助言を押しのけます。",
        takes: "10分",
      },
      {
        title: "自分が対象かどうかを、ガイドではなくアカウントで確かめる",
        body: "Weverseは、関係法令が定める基準に従い、今回の流出の対象となった顧客に対して個別に流出の事実を案内する手続きを行ったとしています。つまり答えはあなた自身のアカウントの中にあります——アカウントに登録されたメールアドレスと、アプリ内の通知です。どのガイドにも分かりません。このページにもです。そして、流出に含まれていたかを確認できると称する第三者は、サービスではなく疑うべき理由です。",
        pitfall:
          "対象かどうかを教えてくれる照会ツールを探すこと。内部識別子の流出について、そうしたツールが有意に照会できるものはありません。そしてその検索自体が、フィッシングのページが待っているものです。",
        takes: "10分",
      },
      {
        title: "同社が「やった」と述べていることと、まだ約束であることを分ける",
        body: "Weverseによる対応の説明を、同社の言葉で。決済情報処理APIについて接近統制を強化し、内部識別子情報を除去して外部に露出しないようにした。9月4日に、点検結果と対応状況を含む侵害事故の届出をKISA（韓国インターネット振興院）に行った。そして対象の顧客に案内した。計画として挙げているのは、外部に露出しているAPIの全数調査、接近統制の強化と露出情報の最小化、配布プロセスの統制、セキュリティ監視の感度向上です。また、異常な攻撃で不正に接近した外部の行為者に対し、該当する個人情報の回収を要請済みで、法的責任を問う予定だとしています。この二つは分けて受け取ってください——前者は社外の誰も監査できない「完了した作業についての主張」であり、後者は意思です。",
        pitfall:
          "改善の計画の一覧を、すでに実施された修正の一覧として読むこと。公知はそう主張していませんし、その要約もそう主張すべきではありません。",
        takes: "5分",
      },
      {
        title: "対応の仕方には、相応の評価を与える",
        body: "Weverseが説明する時系列は短いものです。外部の通報者が脆弱性を報告したことを受け、9月3日にKISAから連絡。直ちに自社点検と緊急対応。9月4日にKISAへ侵害事故の届出。そして代表者名義の公知で、漏れた項目を——法的には個人情報に該当しないと同社が主張する項目まで含めて——列挙しました。それは列挙する義務のなかったものです。当サイトは韓国語の原文を英語版と突き合わせ、同じことを述べていることを確認しました。それ自体も小さな手がかりです。どれも流出を無かったことにはしません。ただ、事件をスキャンダルとしてしか報じないサイトは、まともな対応がどういうものかを読者に何も教えません。そしてこれは、たいていの例よりそれに近いものです。",
        pitfall:
          "落ち着いた評価から「何も起きなかった」と結論すること。422,584件は実際の失敗であり、迅速な公表がそれを打ち消すわけではありません。",
        takes: "—",
      },
      {
        title: "退会する前に二度考える。そして退会が「何ではないか」を知る",
        body: "退会はもう一つの反射で、見た目より大きな決定です。Weverse ShopもNOL Worldも、アカウントに実体のあるものを結びつけています——注文と予約の履歴、保存した住所、有料の会員資格、そしてチケッティング側では完了した本人確認。ただ決定的な点はもっと単純です。退会はこれ以降のデータをサービスから取り除きますが、すでに外へ出たデータを取り戻しはしません。この流出に含まれていたものは、あなたが何かを決める前にすでに含まれていたのであり、あとからアカウントを閉じてもそこには届きません。",
        pitfall:
          "流出への対応としてアカウントを退会すること。そうしたくなるのは当然で、そしてこれへの治療ではありません。さらに、購入について後で争う必要が生じたときに必要な履歴を失います。",
        takes: "—",
      },
    ],
    faq: [
      {
        q: "氏名や住所、カード番号は漏れましたか。",
        a: "Weverse自身の列挙によれば漏れていません。挙げられているのは内部識別番号と購買メタデータ——決済手段、決済PG名、通貨、購買金額と取消金額、購買日時、購買状態、返金日時です。氏名、連絡先、決済の認証情報はリストにありません。",
      },
      {
        q: "Weverseのパスワードを変えるべきですか。",
        a: "変えても害はありませんが、これへの対処ではありません。漏れたのは決済情報APIを通じた識別子と購買メタデータであって、ログインの認証情報ではないので、新しいパスワードはそこに届きません。気持ちが落ち着くならやって、本当の労力は支払い要求を自分で独立に確認することに使ってください。ここであなたを守るのはそちらです。",
      },
      {
        q: "自分が422,584件のうちの一人かどうか、どう分かりますか。",
        a: "自分のアカウントを通じてです。Weverseは関係法令に基づき、対象となった顧客へ個別の案内手続きを行ったとしているので、アカウントに登録されたメールアドレスとアプリ内の通知を確認してください。外部のツールには分かりませんし、分かると称するものはフィッシングとして扱ってください。",
      },
      {
        q: "これで私のカードに課金されることはありますか。",
        a: "Weverseは、これらの項目だけでは決済の偽造や不正送金は起こりにくいとしており、リストを見るかぎりそれは妥当です——漏れた項目のどれもカード番号でも認証情報でもありません。現実的なリスクは直接の課金ではなく、あなた自身に支払わせるよう仕向ける説得力のあるメッセージです。",
      },
      {
        q: "個人情報に該当しないなら、なぜ問題なのですか。",
        a: "攻撃者にとっての有用性と、法的な分類は別の問いだからです。購買金額、日付、決済手段、通貨は、まさに詐欺のメッセージを信じられるものにする材料です——そして不審なメールを判断するとき人が使う通常の方法は、送り主が実在の注文の実在の情報を知っているかどうかです。この流出に含まれた人にとって、その検証はもう機能しません。",
      },
      {
        q: "Weverseのアカウントを削除すべきですか。",
        a: "擁護できる選択ですが、治療ではありません。退会は今後の収集を止めますが、すでに外へ出たデータ——この流出に含まれるものを含めて——を取り戻しはしません。さらに注文と予約の履歴、保存した住所、有料の会員資格、チケッティング側の完了した本人確認を失います。これへの対応としてではなく、まだこのサービスを使いたいかどうかで決めてください。",
      },
      {
        q: "Weverseは実際に何をしたのですか。",
        a: "同社の説明によれば、決済情報APIの接近統制を強化して内部識別子を除去し、2026年9月4日にKISAへ侵害事故の届出を行い、対象の顧客に案内しました。計画としては、外部露出APIの全数調査、配布プロセスの統制強化、監視感度の向上を挙げ、関係する行為者にデータの回収を要請済みで法的責任を問う予定だとしています。完了したとされる項目は、監査された所見ではなく同社の主張です。",
      },
      {
        q: "これより新しい情報はありますか。",
        a: "このページ上部の日付時点ではありません。その日が、当サイトがWeverse Shopの公知一覧を最後に読んだ日です。セキュリティの件は進展しうるので、生きている版はその一覧です——続報があるなら、ここより先にそちらに出ます。",
      },
    ],
    labels: JA_LABELS,
  },
  {
    locale: "ja",
    slug: "nol-world-play-stay-package",
    sourceChecked: "2026-10-20",
    translated: "2026-10-20",
    review: "machine-assisted",
    title: "NOL WorldのPlay&Stay：一つの商品で、ほとんど何も変更できません",
    summary:
      "公演と宿泊が一つの商品として売られます。ホテルも日程も泊数も変えられず、ホテルを使わなくても返金はなく、座席は当日に判明するランダム。そしてチケットは本人に、ホテルで、決められた時間内にしか渡されません。",
    scope:
      "NOL Worldの公演＋宿泊パッケージを、NOL Worldが文書化している内容にもとづいて扱います——何が固定されているか、チケットはどう受け取るか、本人確認と氏名の要件、そしてキャンセルの回答が実際に何と書かれているか。個々のパッケージは独自のキャンセル規定と内容を持ち、商品ページが優先します。シャトルはパッケージに含まれる場合にのみ触れます。",
    intro: [
      "パッケージは楽な選択肢に見えます。支払いは一度、会場の近くのホテル、保証された座席グレード、待機列と戦わなくていい。一度きりの旅に賭ける海外のファンにとって、それは本当に魅力的な取引です。",
      "同時に、これはこのプラットフォームでもっとも硬直した商品で、その硬直さは商品一覧からは見えません。NOL World自身の回答を続けて読むと、ある形が現れます——このパッケージは分割できない一つの商品です。別々に最適化できるチケットとホテルの部屋ではなく、一度買う一つのもので、ほとんどどこも変更できません。以下のすべてが、この一つの事実から導かれます。必要になったときに理不尽に思える部分も含めて。",
    ],
    steps: [
      {
        title: "買っているのは二つの予約ではなく一つの商品だと理解する",
        body: "これがこのガイド全体を一段にしたものです。NOL Worldは、パッケージの泊数は変更できない、パッケージに指定されたチェックイン・チェックアウトの日付は変更できない、ホテルの変更は認められない、と述べています。購入時に泊数を追加することもできません——延泊はホテルとの別の話で、ホテルの価格と空室状況によります。そして1アカウントが買えるのは1商品なので、積み重ねられるものでもありません。",
        pitfall:
          "細かいところはあとで整えるつもりでパッケージを予約すること。1日早く着く、友人の近くのホテルに移る、最後の1泊を削る。どれも文書化された「できません」です。",
        takes: "支払う前に15分",
      },
      {
        title: "ホテルを使わなくても返金はないと受け入れる",
        body: "この問いはNOL WorldのFAQで二通りの形で尋ねられ、二回とも同じ答えが返ってきます——ホテルに泊まらない選択はできますが、ホテル部分の返金はなく、予約を他人に譲渡することもできません。つまり友人の家に泊まってもお金には戻らず、支払った部屋を誰かに渡すこともできません。1泊だけ使って残りを返してもらうことも拒否されています——泊数は固定です。",
        pitfall:
          "ホテル側を、放棄できる保証金のように扱うこと。それは転売もできず、譲渡もできず、取り戻すこともできない側の半分です。",
        takes: "—",
      },
      {
        title: "座席はランダムで、当日に知ることになると見込む",
        body: "パッケージが保証するのはグレードであって位置ではありません。NOL Worldは、選んだカテゴリ以外の区域・ゾーン内の座席はランダムに割り当てられるとし、座席の割当は公演当日にホテルでチケットを受け取るときに表示されるとしています。どこに座るかは公演の数時間前まで分かりません。そして当然の続きも閉じています——座席に不満であることは返金の理由にならず、それでもキャンセル手数料はかかりうる、と。",
        pitfall:
          "座席の位置を前提に計画すること——ファンプロジェクトのための特定の側、レンズのための列。グレードが約束で、残りは当日に見る抽選です。",
        takes: "—",
      },
      {
        title: "ホテルの受付で、本人が、時間内に受け取る",
        body: "このチケットを受け取る方法はちょうど一つです。NOL Worldは、受取はホテル内のNOL Worldチケットデスクでのみ、指定された時間内のみ、そしてチケットは予約者本人にのみ発行され、本人が直接受け取らなければならないとしています。割引対象の別の人が代わりに受け取って参加できるかという問いへの答えは、チケットを受け取り使用できるのは予約者のみで、例外はない、です。指定時間を逃した場合に公開されている答えは、単に「チケットは指定された時間内にのみ受け取れます」です。",
        pitfall:
          "その日の予定を会場中心に組むこと。拘束力のある予定は、公演当日、誰かが決めた時間枠の、ホテルのデスクにあります。",
        takes: "その日をこれを軸に組む",
      },
      {
        title: "デスクが実際に求める書類を持っていく",
        body: "NOL Worldは具体的です——予約者の有効な身分証の原本、そして印刷物またはスマートフォン上の予約確認書。これらがなければチケットは受け取れません。韓国籍以外の方に認められる身分証はパスポートまたは外国人登録証です。韓国籍の方にはより長い一覧があり、住民登録証、運転免許証、パスポート、青少年証、またはGovernment 24やPASSで発行されるモバイル身分証が含まれます。",
        pitfall:
          "デスクが同じ建物の中にあるからと、パスポートを部屋の金庫に置いていくこと。チケットを開けるのは身分証の原本で、その写真は一覧に載っていません。",
        takes: "荷造りに5分",
      },
      {
        title: "2名パッケージは、二人ともデスクにいる必要があります",
        body: "これは一日の組み立てを変えるのに見落としやすい条件です。NOL Worldは、2名用のパッケージでは予約者と同行者の両方が受け取りに立ち会う必要があるとし、同行者も入場の年齢要件を満たすことを確認するために身分証を提示する必要があるとしています。つまり受取の時間枠は、どちらか一人が走ればいい用事ではなく、身分証を持った二人の約束です。",
        pitfall:
          "当日に分かれること——一人がチケットを取りに行き、もう一人が観光したりグッズの列に並んだり。デスクは一人にはチケットを渡しません。",
        takes: "—",
      },
      {
        title: "氏名をパスポートと完全に一致させる。いま",
        body: "NOL Worldはこれに、二つの帰結を一文で答えています——予約時に入力された氏名がパスポートと一致しない場合、チケットの受取とホテルのチェックインができません。パッケージの両方の半分が、同じ一つの誤りで止まります。その問いが挙げている典型例は、綴りの誤り、ミドルネームの欠落、大文字小文字、スペースです。記憶とではなく、パスポートのページそのものと突き合わせて確認してください。",
        pitfall:
          "すでに支払い済みだから小さな違いは見逃されると考えること。支払い済みであることは、どちらのカウンターでも確認されている対象ではありません。",
        takes: "10分",
      },
      {
        title: "ホテルの予約確認メールを待たない。そもそも来ません",
        body: "これは避けられるパニックの原因なので、先に知っておいてください。NOL Worldは、ホテルの予約確認は別途送付されないとし、決済が完了していればホテルの予約は確定して有効だとしています。さらに有用なことに——予約内容がホテルへ渡されるのは宿泊のおよそ2週間前なので、それ以前はホテルが本当にあなたを見つけられません。早めに電話して「そんな予約はない」と言われたなら、それが文書化された正常な状態です。",
        pitfall:
          "6週間前にホテルが予約を見つけられないからと、予備の部屋を取ったりパッケージを買い直したりすること。何も問題はなく、そしていま予約が二つになりました。",
        takes: "安心のために2分",
      },
      {
        title: "チェックインは購入者として行い、細かい内容を読む",
        body: "ホテルのチェックインは、チケットと同じ人物に紐づいています。NOL Worldは、チェックインは予約者の本人確認を経てのみ可能だとしているので、同行者が先にチェックインして待つことはできません。到着が遅れる場合の指示は事前にホテルへ連絡することですが、ホテルの状況によっては対応できない場合があると但し書きしています。予約前に知っておく価値のある具体的な点がもう二つ——未成年者は法定代理人なしには宿泊できず、朝食は特定のパッケージに含まれていないかぎり含まれません。",
        pitfall:
          "友人を先に行かせて荷物を預け、滞在を始めてもらうこと。部屋はあなたの身元で開くのであって、予約番号で開くのではありません。",
        takes: "—",
      },
      {
        title: "シャトルがあるなら、二度目のない一本の出発として扱う",
        body: "パッケージにシャトルが含まれる場合、NOL Worldの回答は淡々としています。利用は任意で、使わなくても返金はありません。予備の車両はないので、乗車場所に遅れればもう行ってしまっています。復路のみの利用は可能です。予約していない同行者は現地のシャトル担当者に相談できますが、座席には限りがあり保証はできないとしています。そして一晩を台無しにしうる細部——スーツケースをバスに持ち込むことはできますが、会場に着いたあとバス車内に荷物を預けることはできません。復路の乗車場所と時刻は、ホテルでチケットを受け取るときに案内されます。",
        pitfall:
          "バスが持ち込みを許したからとスーツケースを公演に持っていくこと。会場に置く場所はなく、公演のあいだずっと持っていることになります。",
        takes: "—",
      },
      {
        title: "キャンセルの回答を予約前に読む。答えは「できません」だからです",
        body: "旅がまだ計画のうちに真剣に受け取るべき段です。NOL Worldはもっとも難しい二つの場合について回答を公開しており、どちらも拒否です。感染について——新型コロナウイルスの危険度分類が引き下げられ隔離が義務ではなくなったことに伴い、感染していてもキャンセル手数料の減免は適用されません。家族の死去や事故による入院について——個人的な事情による返金はなく、キャンセル手数料は各商品の規定に従って適用されます。これが厳しいと読めるにせよ単に明確だと読めるにせよ、リスクがどこにあるかを教えてくれます——支払った瞬間から、あなたにあります。そのリスクを引き受けるために設計された手段は出発前に加入する旅行保険であり、実際に何が補償されるかは加入する約款によるので、思い込まずにその文書を読んでください。",
        pitfall:
          "十分に重大な理由なら認められるだろうと考えて、保険なしでリスクを抱えること。NOL Worldは、考えうるもっとも重大な二つの理由について、すでに答えを公開しています。",
        takes: "保険の約款と30分",
      },
    ],
    faq: [
      {
        q: "パッケージを買って、ホテルを使わないことはできますか。",
        a: "泊まらない選択はできますが、NOL Worldはホテル部分は返金不可で、予約を他人へ譲渡することもできないとしています。パッケージに含まれる泊数より少なく使って差額を返してもらうことも、泊数を変更できないため拒否されています。",
      },
      {
        q: "滞在を延長・短縮したり、日程やホテルを変えたりできますか。",
        a: "泊数は変更できず、パッケージのチェックイン・チェックアウト日も変更できず、ホテルの変更も認められません。購入時に延泊を追加することもできません——NOL Worldの案内は、空室と料金についてホテルへ直接問い合わせることで、できない場合もあります。部屋のアップグレードも同じで、ホテルに尋ね、到着時にホテルへ直接支払います。",
      },
      {
        q: "座席はいつ分かりますか。",
        a: "公演当日、ホテルでチケットを受け取るときです。パッケージが保証するのはグレードで、そのグレードの中では、NOL Worldが区域と座席をランダムに割り当てます。結果に不満であることは返金の理由になりません。",
      },
      {
        q: "誰かに代わりにチケットを受け取ってもらったり、代わりに参加してもらったりできますか。",
        a: "できません。NOL Worldは、チケットは予約者にのみ発行され本人が直接受け取る必要があるとし、受け取って使用できるのは予約者のみで例外はないとしています。2名パッケージでは二人ともデスクにいる必要があり、同行者も年齢確認のため身分証を提示します。",
      },
      {
        q: "ホテルの予約確認メールが届きません。",
        a: "そもそも届きません。NOL Worldは、ホテルの確認は別途送付されず、決済が成功していればホテルの予約は確定しているとしています。また、予約内容がホテルに届くのはチェックインのおよそ2週間前で、直接の確認はそれ以降にのみ可能だとしています。",
      },
      {
        q: "ホテルに電話したら予約が見つからないと言われました。",
        a: "早く電話したのであれば想定どおりです。NOL Worldは、内容がホテルに送られるのは宿泊のおよそ2週間前で、確認が可能なのはそれ以降だとし、パッケージの予約と決済が正しく完了していればホテルの予約は確保されているとしています。取り直さないでください。",
      },
      {
        q: "感染した、あるいは家族に不幸がありました。キャンセル手数料は免除されますか。",
        a: "NOL Worldが公開している答えは、どちらの場合も「いいえ」です。新型コロナの隔離が義務でなくなったことに伴い、感染していてもキャンセル手数料の減免はないとし、家族の死去や事故による入院を含む個人的な事情による返金はなく、各商品の規定に従って手数料が適用されるとしています。このリスクのための手段は、渡航前に加入する旅行保険です——何が補償されるかは約款によるので、読んでください。",
      },
      {
        q: "シャトルは必ず使う必要がありますか。スーツケースは持ち込めますか。",
        a: "任意で、使わなくても返金はありません。スーツケースはバスに持ち込めますが、NOL Worldは会場に着いたあとバス車内に荷物を預けることはできないと警告しています——持ち込んだスーツケースは、自分で持ち続けるスーツケースです。出発に遅れた場合の予備車両はなく、復路の乗車場所と時刻はホテルでチケットとともに案内されます。",
      },
    ],
    labels: JA_LABELS,
  },
  {
    locale: "ja",
    slug: "buy-k-pop-albums-from-overseas",
    sourceChecked: "2026-10-20",
    translated: "2026-10-20",
    review: "machine-assisted",
    title: "海外からK-POPのアルバムを、集計に入る形で買う方法",
    summary:
      "どこで買うかが、その購入が集計されるか、送料がいくらかかるか、予約特典を受け取れるかを決めます。選び方を説明します。",
    scope:
      "韓国外への配送で公式のフィジカルアルバムやグッズを買うことを扱います。転売マーケットプレイスや非公式グッズは扱いません。",
    intro: [
      "これはチケットと違って一年じゅう続く問いで、だからこそチケットの隣に置いています。そしてチケットと違い、間違った答えが目に見える形では何も奪いません——アルバムは届きます。ただ集計に入らなかっただけです。",
      "どこで買うかによって三つが変わります。その売上が韓国のチャートに報告されるかどうか、予約特典が付いてくるかどうか、そして送料と関税まで入れた実際の総額。この三つは一緒には動かないので、いちばん安い選択肢が何の集計にもならない、ということが頻繁に起きます。",
    ],
    steps: [
      {
        title: "その購入で実際に何が欲しいのかを決める",
        body: "チャートへの反映、フィジカルのアルバムそのもの、予約特典、あるいは最安値。これらは別々の方向に引っ張ります。店を選ぶ前に優先順位を決めてください。店はその下流にあります。",
        pitfall:
          "節約のために一般のマーケットプレイスで買い、そのあと集計に入っていなかったと気づくこと。この間違いの標準的な形です。",
        takes: "5分",
      },
      {
        title: "その販売店が韓国のチャートに報告しているか確認する",
        body: "韓国のアルバムチャートに報告される売上は、特定の小売店と公式ストアから出ています。出品が本物の公式アルバムであることは、その売上が報告されたことを意味しません。チャートへの反映が購入の理由なら、注文する前にその販売店が報告対象かどうかを確かめてください。",
        pitfall:
          "第三者のマーケットプレイスに出ている本物のアルバムは、集計に入らないことがよくあります。アルバムは本物で、反映だけがありません。",
        takes: "15分",
      },
      {
        title: "特典が欲しいなら予約期間の内側で注文する",
        body: "予約特典——ポスター、追加のフォトカード、イベント応募券——は、期間内に注文することと、多くの場合その特定の販売店で注文することに紐づいています。その期間は発売日ではなく、発売日より前に閉じます。",
        pitfall:
          "販売店限定の特典は互換性がありません。同じアルバムを他で注文すると、別の特典になるか、何もありません。",
        takes: "10分",
      },
      {
        title: "アルバムではなく、送料と関税の見込みを計算する",
        body: "韓国からの送料はアルバムの価格を上回ることがあり、その上に輸入時の課金がかかるかどうかは自分の国の規定によります。思い込まずに、いまどうなっているかを確認してください——米国は2025年8月に800ドルの基準を停止し、EUは2026年7月1日に150ユーロの基準を撤廃したので、どちらかにお住まいの読者にとっては、無税で届くほど小さい金額というものがもう存在しません。共同購入は1点あたりの送料を下げます。確定する前に、到着までの総額を出してください。",
        pitfall:
          "自分の住む場所にもう存在しない免税枠を前提に計画すること。まだ免税枠がある国では、複数のアルバムを一つの小包にまとめると申告価格がその枠を超え、別々に送るより高くつくことがあります——両方の数字を出してください。",
        takes: "20分",
      },
      {
        title: "届くまで注文の記録を保管する",
        body: "注文確認、追跡番号、申告価格を保存してください。何か問題が起きたとき——小包の破損、税関からの照会、特典の欠品——販売店が尋ねてくるのはこれらです。",
        pitfall:
          "韓国の販売店のサポートは、メールでの検索ではなく注文番号で動くことが多いです。番号がないとやり取りが遅くなります。",
        takes: "5分",
      },
    ],
    faq: [
      {
        q: "韓国外で買ったアルバムは韓国のチャートに反映されますか。",
        a: "参加している販売店が報告した売上は反映され、それはあなたの居場所ではなく販売店によります。報告していない店で本物のアルバムを買えば、アルバムは本物でも売上は集計されません。チャートへの反映が目的なら、注文する前に販売店を確認してください。",
      },
      {
        q: "共同購入はした方がいいですか。",
        a: "送料については通常はそうです。1点あたりのコストが大きく下がります。自分の国の輸入規定と併せて判断してください——免税枠がまだある国では、高額な小包が一つだと、別々の小さな小包なら生じない課金が発生することがあります。米国とEUではこの計算が変わりました。どちらも少額免税を撤廃したので、下回るべき基準そのものが残っていません。",
      },
      {
        q: "予約特典が店によって違うのはなぜですか。",
        a: "販売店はそれぞれ独自の限定特典を交渉しているので、同じアルバムでも予約した場所によって付く特典が変わります。特定の特典が目的なら、それを出している店で、その期間内に注文する必要があります。",
      },
    ],
    labels: JA_LABELS,
  },
  {
    locale: "ja",
    slug: "order-from-weverse-shop-overseas",
    sourceChecked: "2026-10-21",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "韓国外からWeverse Shopで注文する",
    summary:
      "自分がどのショップにいるのか、なぜ決済画面で金額が上がるのか、自分の通貨で実際に使える決済手段は何か、そして韓国から発送できない国について。",
    scope:
      "韓国から発送されるフィジカルのグッズとアルバムについて、Weverse Shopでの注文を扱います。会員資格の購入とチケッティングは別扱いで、先行販売ガイドで扱っています。ここの規定はWeverse Shop自身の公知によるもので、予告なく変わります。",
    intro: [
      "Weverse Shopについての英語ガイドのほとんどは、いまもグローバルストアはPayPalかEximbayしか受け付けないと書いています。それは何年か前には本当でした。決済手段の一覧は現在もっと長く、住んでいる国ではなくアカウントが設定されている通貨によって決まり、そして2026年2月以降、商品ページの価格は支払う価格ではありません。",
      "どれも隠されてはいません——ショップ自身の公知に書かれており、以下のすべてはそこから来ています。ただ、こうしたガイドを書いた人が読みに行かなかっただけです。",
    ],
    steps: [
      {
        title: "自分が実際にどのWeverse Shopにいるのかを把握する",
        body: "Weverse Shopは一つの店ではありません。GLOBALショップと地域ショップがあり、取り扱う在庫も、予約期間も、発送元も異なります。誰かが注文したのを見た商品が、あなたのショップには単に存在しないことがあります。発売日を前提に計画する前にどこにいるかを確認してください。一方のショップの予約締切は、他のショップについて何も教えません。",
        pitfall:
          "ファンコミュニティで共有されたリンクが開くのは、その人のショップであってあなたのショップではありません。ページは開くのにカートに入れられないなら、たいてい遅すぎるのではなく、違うショップにいます。",
        takes: "2分",
      },
      {
        title: "何かを見る前に通貨を設定する",
        body: "既定の通貨が、提示される決済手段を決めます。Weverseは通貨ごとにこう示しています。USDはPayPal、Eximbay、Alipay+、Apple Pay、WeChat Pay、Grab Pay。JPYはGrab Payを除く同じ一覧です。CNYはPayPalが外れます。MXNはPayPalとApple Payのみ。KRWには韓国のカードと韓国のウォレット——Toss、NAVER Pay、Kakao Pay、PAYCO——が加わります。MXNは韓国以外の四つの一覧で最も短く、事前に備えておく価値があるのはこれです。手段は二つ、どちらも電子決済で、現金の選択肢はありません。どちらも用意していなければ、決済画面に三つ目のボタンはありません。",
        pitfall:
          "KRW以外の通貨に「Visaで払う」という素の選択肢はありません。カードはPayPalかEximbayを経由します。それは銀行から見れば韓国の加盟店への請求とは別種の取引で、他ではうまくいくカードがここで失敗しうる理由です。",
        takes: "3分",
      },
      {
        title: "決済画面で金額が上がることを見込み、その理由を知る",
        body: "2026年2月3日以降、Weverseは配送先と請求先の住所から税額を計算します。韓国向けの注文は最初から最後まで税込価格で表示されます。それ以外へ向かう注文は、商品ページでは税抜で表示され、住所を入力した時点で配送先の税が決済画面で加算されます。商品ページの数字は支払う数字ではなく、それは不具合ではなく意図された仕様です。",
        pitfall:
          "これは詐欺や不具合に見えるのとまったく同じ見え方で、人が注文を放棄する地点です。増えた分は、あとから税関で取られる代わりに前もって徴収される、あなたの国の税です。",
        takes: "1分",
      },
      {
        title: "配送先だけでなく請求先住所も入力する",
        body: "同じ2026年2月の変更で、決済画面に請求先住所の欄が追加されました。税額の計算に必要だからです。一部の無形商品——デジタルアイテムやコンテンツ——では、請求先住所が任意ではなく必須になる場合があります。正確に入力してください。税率はそこから計算され、間違いをあとから静かに直すことはできません。",
        pitfall:
          "配送先をそのまま請求先にコピーすること。同じなら問題なく、違うなら誤りです。カードが別の住所で登録されているなら、そちらを使ってください。",
        takes: "2分",
      },
      {
        title: "住所の言語を配送先に合わせて確認する",
        body: "Weverseは海外の顧客に対し、入力する前に配送先の国がどの言語で住所を必要とするか確認するよう求めています。逆方向のほうが規定は明確です——韓国へ送る注文は住所を韓国語で記載する必要があります。配送業者が英語の住所を受け付けない、あるいは誤って処理する場合があるためです。それ以外の宛先には、自国の郵便が想定する書き方で書いてください。",
        pitfall:
          "韓国の住所を英語に音訳すること。韓国向けの注文で、配送の遅延や失敗を招くもっとも多い原因です。",
        takes: "5分",
      },
      {
        title: "そもそも韓国から自分の国へ送れるか確認する",
        body: "韓国からの発送が利用できない国・地域の一覧をWeverseが管理・更新しています。2026年7月15日改訂時点では、ミャンマー、コンゴ民主共和国、イラク、イラン、レバノン、マリ、ロシア、アンドラ、ウクライナ、ベラルーシ、アフガニスタン、オランダ領アンティル、イスラエル、トルコが含まれます。一覧は動くので、このページではなく公知を確認してください。",
        pitfall:
          "この一覧は方針ではなく一時的な支障として説明されています。つまり国が追加されることも、外れることもあります。過去に注文できたことも、友人が昨年注文できたことも、今日注文できるかどうかを決めません。",
        takes: "2分",
      },
      {
        title: "特典が目的なら予約期間の内側で注文する",
        body: "予約特典——ポスター、フォトカード、初回盤の封入物。安い場所ではなく公式ストアで注文する理由はたいていこれです——はアルバムではなく予約期間に紐づいています。期間が閉じれば、同じアルバムがそれらなしで発送されます。特典が目的なら、計画の軸にすべきは発売日ではなく締切です。",
        pitfall:
          "予約の締切は韓国時間の時刻で閉じます。このサイトの読者の多くが住む場所では、それは前日の夕方か未明です。",
        takes: "締切より前に",
      },
    ],
    faq: [
      {
        q: "Weverse ShopでVisaやMastercardは使えますか。",
        a: "韓国ウォン設定以外では、直接のカード選択肢としては使えません。USD、JPY、CNY、MXNでは、カードはPayPalかEximbayを経由します。最終的にはあなたのカードに届きますが、銀行から見える取引の種類が変わるので、事前に海外決済を有効にしておく価値があります。",
      },
      {
        q: "住所を入力したら金額が上がったのはなぜですか。",
        a: "2026年2月3日以降、韓国外の価格は商品ページでは税抜で表示され、配送先の税が決済画面で加算されるためです。それはあなたの国が課す税で、配送時ではなく購入時に徴収されています。",
      },
      {
        q: "届いたときに関税を請求されますか。",
        a: "Weverseは該当する注文について、決済時に関税と税を前払いするようになったとし、これにより通関時の追加支払いの必要が減るとしています。ただしすべての国・地域に適用されるわけではないとしているので、保証ではなく合理的な期待として受け取ってください。",
      },
      {
        q: "メキシコにいます。実際に使える決済手段はどれですか。",
        a: "二つです。Weverseの決済に関する案内はMXNをPayPalとApple Payとしています。韓国以外の四つの通貨の一覧で最も短く、どちらも電子決済です。現金の選択肢も三つ目のボタンもありませんので、予約受付の最中ではなく、その前にどちらかを用意しておいてください。",
      },
      {
        q: "Weverse Shopは私の国へ発送しますか。",
        a: "たいていは発送します。ただし現在、韓国からの発送を受けられない国・地域の一覧が管理されています。注文の前にその公知で現在の一覧を確認してください——状況に応じて改訂されます。",
      },
    ],
    labels: JA_LABELS,
  },
  {
    locale: "ja",
    slug: "yes24-global-ticketing-guide",
    sourceChecked: "2026-10-14",
    translated: "2026-10-20",
    review: "machine-assisted",
    title: "YES24 Globalのチケッティング：英語ページに書かれていない規定",
    summary:
      "既存のYES24アカウントは使えません。PayPalは公演が十分に先の場合にしか現れません。2種類のカードは一律で拒否され、会場では登録した氏名とパスポートが照合されます。",
    scope:
      "海外購入者が使う英語版のYES24 TICKETサイトを扱います。韓国語版のYES24サイトは別のアカウント体系と別の本人確認を運用しています。公演ページの個別条件がここのすべてに優先し、YES24自身もそう述べています。",
    intro: [
      "YES24は海外向けの規定を英語の購入案内とFAQで公開していますが、この話題で上位に出てくるガイドには、そこに書かれていることがほとんど出てきません。内容は具体的で、変わっていて、そのいくつかは決済画面で初めて出会えばその日の予約を終わらせます。",
      "以下のすべては、その2ページを2026年10月20日に読んだものです。YES24が自己矛盾している箇所——実際に一度、手数料について矛盾します——については、都合のいい数字を選ばずにそう書いています。",
    ],
    steps: [
      {
        title: "YES24のアカウントを持っていても、もう一度登録する",
        body: "YES24は率直に述べています——Global YES24 TICKETサイトを使いたい既存のYES24会員は、改めて登録する必要があります。さらに、Globalチケットサイトは書店のglobal.yes24.comとは別物で、両者は会員情報を共有しないと警告しています。非会員はそもそも予約できないので、これは形式ではなく最初の工程です。",
        pitfall:
          "似た名前のYES24のサービスが三つあり、ログインは共有されません。待機列の中でこれに気づくのは、気づくのが遅すぎるということです——次の氏名の照合のために、どのみちアカウントは数日前に存在している必要があります。",
        takes: "15分",
      },
      {
        title: "氏名をパスポートのとおりに登録する",
        body: "ここは、プラットフォームが本音をはっきり書いている数少ない場所です。YES24のFAQ——YES24のアカウント名がパスポートの氏名と異なる場合、会場で予約したチケットを受け取る際に問題が生じることがあります。窓口受取のチケットはチケット保有者本人しか受け取れず、受取には予約記録とともに実物の有効な身分証——パスポート——が必要です。",
        pitfall:
          "ミドルネームの省略、何年も前に決めたローマ字表記、名が先の語順。会場は二つの書類を見比べているのであって、見るからに本人かどうかを判断しているのではありません。",
        takes: "10分",
      },
      {
        title: "自分の公演でそもそもPayPalが提供されるか確認する",
        body: "YES24 GlobalのPayPalは、予約日と公演日の間が180日を超える場合にのみ利用できます。1〜2か月前に発表される多くのK-POPコンサートでは、PayPalはそもそも選択肢にならず、カードが唯一の経路だということです。またPayPalには10セントの手数料があり、キャンセルしても返金されません。",
        pitfall:
          "「PayPalが使える」と書いたガイドを前提に計画して、決済画面にカード欄しかないと気づくこと。理由は180日の規定です——エラーでもなく、サポートが免除できるものでもありません。",
        takes: "2分",
      },
      {
        title: "試す前に、拒否されるカードを知っておく",
        body: "購入案内は、韓国外で発行されたアメリカン・エキスプレスと、中国UnionPayのカードを全面的に除外しています。それ以外はカード決済として通ります——そしてYES24は、Globalサイトでは3Dセキュア認証が必須だとしているので、カードは銀行側でその登録が済んでいる必要があります。",
        pitfall:
          "他のどのサイトでも使えるAmexが、カード自体ではなく発行された場所を理由にここで拒否されます。その失敗は銀行によるブロックとまったく同じに見えるので、人は販売の時間を、間違った問題について銀行に電話して使ってしまいます。",
        takes: "銀行と10分",
      },
      {
        title: "窓口受取か海外配送かを、予約の時点で選ぶ",
        body: "窓口受取と海外配送の両方がありますが、海外配送は全公演共通ではなく公演ごとです。YES24は、利用可否は公演によって異なり、料金は配送先によって異なり、それは公演ページに記載されるとしています。受取方法の変更が可能なのは公演の20営業日前までです——4営業週であって、4日ではありません。",
        pitfall:
          "20営業日はカレンダー上ではおよそ1か月です。2週間前に予約したなら、待機列の中で選んだ方法がそのまま使う方法になります。",
        takes: "5分",
      },
      {
        title: "予約とキャンセルの時計を読む。公演日ではありません",
        body: "予約は、火曜から土曜の公演については前日の17時に、日曜・月曜の公演については土曜の11時に締め切られます。キャンセルもまったく同じ時計で動き、それを過ぎるとキャンセルも変更も返金もありません。キャンセルは購入から7日以内なら無料で、それ以降は公演が近づくにつれ支払額の10%、20%、30%とチケット1枚あたりの手数料が上がります。1人が一度に買えるのは10枚までです。",
        pitfall:
          "予約手数料はYES24が自己矛盾している箇所です。FAQはある行で2,000ウォンと書き、次の行で2023年8月14日から1枚あたり3,000ウォンへ変更すると告知しています。3,000を現行として扱ってください。いずれにせよ、この手数料が返金されるのは購入当日の23時59分までで、チケット本体をカバーする7日間の枠ではありません。",
        takes: "5分",
      },
      {
        title: "会場にはパスポートと予約記録を持っていく",
        body: "受取には実物の有効な身分証——YES24はパスポートを挙げています——と、予約確認の記録が必要です。購入案内は、購入内容を印刷して窓口で提出するようにも書いています。公演ページの個別規定がこれに優先し、YES24自身が公演ページが優先すると述べているので、その会場で以前受け取ったことがあっても読んでください。",
        pitfall:
          "スマホに入れた確認画面の写真は、ここで説明されているものではありません。印刷し、他のどの身分証でもなく登録に使ったパスポートを持っていってください。",
        takes: "会場にて",
      },
    ],
    faq: [
      {
        q: "既存のYES24アカウントを英語サイトで使えますか。",
        a: "使えません。YES24は、既存会員もGlobal YES24 TICKETサイトには改めて登録する必要があるとし、書店のglobal.yes24.comとは別で会員情報を共有しないとしています。",
      },
      {
        q: "決済画面にPayPalがないのはなぜですか。",
        a: "PayPalは、予約日と公演日の間が180日を超える場合にのみ提供されます。多くのコンサートの予約はその範囲に十分収まらないので、カードが唯一の経路になります。",
      },
      {
        q: "YES24 Globalが拒否するカードは何ですか。",
        a: "韓国外で発行されたアメリカン・エキスプレスのカードと、中国UnionPayのカードです。それ以外は受け付けられますが、サイトが必須としている3Dセキュアを通過する必要があります。",
      },
      {
        q: "他の人が代わりにチケットを受け取れますか。",
        a: "できません。窓口受取のチケットは、実物のパスポートと予約記録を持った本人しか受け取れません——個別の公演がそのページで別途定めている場合を除きます。",
      },
      {
        q: "返金にはどれくらいかかりますか。",
        a: "カードの返金は3〜7日とされ、カード会社の規定によっては最大30日とされています。PayPalの返金は5営業日以内にPayPal残高へ戻りますが、返金日のレートで、換算のスプレッドを含むため、戻る金額が支払った金額より少なくなることがあります。",
      },
    ],
    labels: JA_LABELS,
  },
  {
    locale: "ja",
    slug: "weverse-shop-shipping-delays-and-cancellation",
    sourceChecked: "2026-10-20",
    translated: "2026-10-20",
    review: "machine-assisted",
    title: "Weverse Shopの注文が遅れている理由と、まだキャンセルできる時点",
    summary:
      "キャンセルボタンは期限ではなく「状態の変化」で消えます。EUは150ユーロの免税を撤廃し、米国は関税とは別の検査制度を上乗せしました。そして韓国の連休には分単位の締切があります。",
    scope:
      "Weverse Shopで注文したあとに起きることを、同社の公知にもとづいて扱います——キャンセルできる期間、EUと米国について警告されている通関の変更、連休と物流による遅延、そして実際の売り手は誰か。連休の日付は2026年のもので来年には違います——生きている版は公知の一覧です。注文そのものは別のガイドで扱っています。",
    intro: [
      "Weverse Shopは配送に関する公知を継続的に出していますが、荷物が遅れるまでほとんど誰も読みません。実際の答えはそこにあります——自分にどの通関の変更が当てはまるのか、どの連休が4日を食べたのか、そして注文がキャンセルできなくなった正確な瞬間が。",
      "以下はその流れをまとめて読んだものです。二つは季節的な遅延ではなく新しい規定で、そのうち一つは、あなたのお金が返ってこなくなる瞬間です。",
    ],
    steps: [
      {
        title: "キャンセルの期間は時計ではなく「状態」で閉じると知る",
        body: "何かが起きる前に知っておく価値のある事実です。Weverse Shopはキャンセルの経路をWeverseアプリ →「もっと見る」→ 注文履歴 → 注文詳細 → 注文キャンセル と示し、注文の状態が「発送準備中」または「配送中」に変わるとキャンセルできなくなるとしています。猶予期間の記載はなく、注文から何時間という規定もありません。倉庫が状態を変えるまでが期間で、人気のリリースでは思うより早く変わります。",
        pitfall:
          "勢いで予約した商品を、一晩考えて決めようとすること。締切は調べられる時刻ではなく、あなたが制御できない出来事であり、寝ているあいだに過ぎることがあります。",
        takes: "すぐに5分",
      },
      {
        title: "EUにお住まいなら、150ユーロの免税はなくなりました",
        body: "Weverse Shop自身の公知は、一般的な報道が曖昧にするところを具体的に書いています。2026年7月1日からEUは少額輸入の規則を改定しました——従来は150ユーロ未満の注文が関税を免除されていましたが、その免除は撤廃され、購入金額にかかわらず関税がかかるようになりました。もっとも重要なのは基準です——Weverseは、2026年7月1日以降に現地で通関する出荷に適用されるとし、注文日ではなく現地通関日を基準としています。変更前に出した注文でも、後で通関すれば対象になりえます。",
        pitfall:
          "少額の注文は安すぎて課税対象にならないと考えること。下限はもう存在せず、それを決める日付は注文画面からは見えません。",
        takes: "10分",
      },
      {
        title: "税関か配送業者が、直接あなたにお金を求めてくると見込む",
        body: "Weverse Shopは、EU向けの注文は現地通関時に関税がかかる場合があり、現地の税関または配送業者から別途支払いの案内を受け取ることがあり、それを支払わないと配送が遅れたり受け取れなくなったりするとしています。これは決済時の課金とは別の体験です——取引したことのない会社からメッセージが届き、すでに支払った荷物が動く前にお金を求めてくる。初めから詐欺だと決まっているわけではありませんが、詐欺が模倣するのもまさにこれなので、メッセージ内のリンクをたどるのではなく、追跡番号を自分の注文と照合してください。",
        pitfall:
          "税関や配送業者からの支払い案内をフィッシングだと決めつけて放置すること。未払いは、注文がそのまま届かなくなる文書化された経路の一つです。",
        takes: "—",
      },
      {
        title: "米国にお住まいなら、変更は一つではなく二つだと知る",
        body: "関税の変更ばかりが報じられますが、米国向けの荷物を遅くしているのはそれだけではありません。Weverse Shopは別途、2026年7月8日から米国消費者製品安全委員会（CPSC）が電子申告を義務化し、米国へ輸入されるすべての物品に対して現地の通関検査が厳格化されると警告し、通関に通常の配送期間より数日多くかかる見込みだとしています。これは関税ではなく製品安全の申告制度です——つまり米国向けの注文は、関税額とは無関係な理由で遅くなりえます。",
        pitfall:
          "米国のあらゆる遅延を少額免税の撤廃のせいだと読み、来ない関税の請求を待つこと。この二つの変更は、一方がお金を、もう一方が日数を要求します。",
        takes: "5分",
      },
      {
        title: "韓国の連休は分単位の締切として扱う",
        body: "Weverse Shopは韓国の連休ごとに締切の予定を公開しており、時刻は正確です。2026年の秋夕では、韓国外の住所向けの注文締切は9月23日11時（KST）で、特急配送の再開は9月28日。韓国の住所向けは配送業者の締切が9月22日11時（KST）で、再開は同じ日でした。締切後の注文は再開日から順次発送されます。Weverseは二つの但し書きを添えています——地域によっては締切日に発送された荷物も連休明けに届く場合があること、そしてこの予定は配送業者の発表にもとづくもので変更されうることです。",
        pitfall:
          "これらの日付を今年のものとして読むこと。これは2026年の秋夕の数字で、引き継がれるのはパターンのほうです——1〜2日前の11時（KST）に締切、1週間ほど後に再開。日付そのものは毎回調べる必要があります。",
        takes: "連休前の注文に10分",
      },
      {
        title: "配送先が中国なら、もう一つの連休カレンダーが適用される",
        body: "Weverse Shopは中国の連休について別の公知を出しています。対象は配送先住所が中国の注文で、理由は中国の税関が閉まって通関が止まるためです。2026年の中秋節（9月25〜27日）と国慶節（10月1〜7日）については、9月15日11時（KST）までに全額決済された注文は国慶節期間中に配送される見込みで、それ以降に決済された注文は連休が明ける10月8日から発送を開始するとしていました。基準は注文したことではなく、決済が完了していることである点に注意してください。",
        pitfall:
          "決済の完了が思っているより遅れている予約注文。締切が全額決済で定義されている場合、未決済のまま置かれた注文は3週間の空白の向こう側にある注文です。",
        takes: "10分",
      },
      {
        title: "物流の混乱と、荷物の紛失を区別する",
        body: "通関でも連休でもない遅延があります。2026年4月、Weverse Shopはヨーロッパ全域と中東の一部地域向けの配送遅延を案内しました。原因は国際物流の経路と航空・海上の便のスケジュールの変動で、対象は2026年4月1日以降に発送され国際輸送中の注文でした。有用なのは追跡についての記述です——経路変更のため追跡情報の更新と現地到着が通常より時間がかかる場合があり、荷物は輸送中である、としています。既知の混乱のあいだの静かな追跡は、紛失の証拠ではなく想定される症状です。",
        pitfall:
          "追跡が1週間動かないからと紛失の申告を出すこと。まず公知の一覧で自分の地域を含む進行中の混乱がないか確認してください——単に経路変更されているだけの荷物に申告を出すと、本当に必要になったときの時間を使ってしまいます。",
        takes: "10分",
      },
      {
        title: "そもそもWeverseが売り手かどうか確認する",
        body: "Weverse Shopは自社のページで、一部の商品は個人の第三者販売者が提供しており、その場合Weverse Companyは電子商取引の仲介者として行動するのみで取引の当事者ではなく、当該販売者の商品情報や取引について責任を負わないと述べています。これは何か問題が起きたときに誰を相手にするかを変えます——第三者の商品では、相手方はWeverseではなく販売者です。苦情を言う必要が生じてからではなく、その前に確かめておく価値があります。",
        pitfall:
          "同じ決済画面の向こう側にあるから、ストア上のすべてが同じ後ろ盾を持っていると思い込むこと。仲介者としての免責は公開されており、それが誰にあなたへの救済義務があるかを決めます。",
        takes: "5分",
      },
      {
        title: "公知は自分で読む。このページはたいていより早く古くなります",
        body: "ここまでのすべてはWeverse Shopの公知一覧から来ており、その一覧が生きている版です。通関の変更は持続しますが、連休の予定、物流の混乱、配送業者の締切はそうではありません——機会ごとに出し直され、古い公知はそのままに、差し替えられていきます。連休前の注文のとき、あるいは荷物が遅れているときは、どのガイドの日付も——このページのものも含めて——信じずに公知の一覧を読んでください。このページ上部の日付は、当サイトが最後にそれをした日です。",
        pitfall:
          "昨年書かれたガイドの締切時刻を信じること。構造は繰り返し、数字は繰り返しません。",
        takes: "5分",
      },
    ],
    faq: [
      {
        q: "まだ注文をキャンセルできますか。",
        a: "状態が許すあいだだけです。Weverse Shopの経路はWeverseアプリ →「もっと見る」→ 注文履歴 → 注文詳細 → 注文キャンセル で、状態が「発送準備中」または「配送中」に変わるとキャンセルできなくなるとしています。公開された猶予期間はないので、答えは時計ではなく注文の状態によります。",
      },
      {
        q: "EUにいて、注文に関税が請求されました。これは正しいのですか。",
        a: "おそらく正しいです。Weverse Shopは、2026年7月1日からEUが150ユーロ未満の注文を対象としていた免税を撤廃し、金額にかかわらず関税がかかるようになったとし、基準はその日以降に現地で通関する出荷だとしています。また、税関や配送業者から別途支払いの案内を受け取る場合があり、支払わないと配送が遅れたり届かなかったりすると警告しています。",
      },
      {
        q: "関税がかからないのに、なぜ米国向けの注文が遅いのですか。",
        a: "変更が二つあるからです。関税の規定とは別に、Weverse Shopは2026年7月8日から米国CPSCが電子申告を義務化し、米国へ輸入されるすべての物品の検査が厳格化され、通関に数日多くかかる見込みだと警告しています。こちらはお金ではなく時間のコストです。",
      },
      {
        q: "関税の支払いを求めるメッセージが来ました。詐欺ですか。",
        a: "本物でありえます——Weverse ShopはEUの顧客が現地の税関や配送業者から別途支払いの案内を受け取る場合があるとしています。そして詐欺が模倣するのもまさにこれです。追跡番号を自分の注文と照合し、メッセージ内のリンクではなく配送業者のサイトへ自分で行って確認してください。",
      },
      {
        q: "韓国の連休に注文する場合の締切はいつですか。",
        a: "Weverse Shopが連休ごとに分単位で公開しています。2026年の秋夕では、韓国外の住所向けの締切は9月23日11時（KST）、特急配送の再開は9月28日でした。予定は配送業者のもので変更されうること、締切日に発送された荷物も連休明けに届く場合があることを但し書きしています。これらの日付を流用せず、現在のものを調べてください。",
      },
      {
        q: "追跡が1週間更新されません。荷物は紛失したのですか。",
        a: "まず公知の一覧で、自分の地域を含む進行中の混乱がないか確認してください。2026年4月にヨーロッパと中東の遅延を案内した際、Weverse Shopは経路変更により追跡の更新と現地到着が通常より遅くなり、荷物は輸送中であるとしていました——既知の混乱のあいだ追跡が止まって見えるのは、問題ではなく症状です。",
      },
      {
        q: "商品に問題があります。Weverseとやり取りするのですか。",
        a: "常にそうとは限りません。Weverse Shopは、一部の商品は個人の第三者販売者が販売しており、その場合Weverse Companyは仲介者として行動するのみで取引の当事者ではなく、当該販売者の商品情報や取引について責任を負わないと述べています。誰に連絡するか決める前に、どちらの商品を買ったのか確認してください。",
      },
      {
        q: "中国にいないのですが、中国の連休の予定は関係ありますか。",
        a: "公知は、それらの予定が配送先住所が中国の注文に適用されるとしています。中国の税関が連休中に閉まるためです。住所がそれ以外なら、注意すべきは韓国の連休の締切と、進行中の物流の混乱のほうです。",
      },
    ],
    labels: JA_LABELS,
  },
  {
    locale: "zh-Hant",
    slug: "buy-k-pop-concert-tickets-from-overseas",
    sourceChecked: "2026-10-14",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "如何從韓國以外購買 K-POP 演唱會門票",
    summary:
      "開始之前先看全貌：你要看的場次在哪個平台開賣、它會做哪一種身分驗證、以及開賣前必須先準備好什麼。",
    scope:
      "涵蓋在南韓境內舉行的演出，以及韓國經紀公司使用的售票平台。海外巡迴場次由當地主辦單位販售，屬於另一回事，以下規則並不適用。",
    intro: [
      "在這個問題上排名最前的英文指南，幾乎都寫於 2025 年 12 月之前，告訴你去一個已經不叫那個名字的網站。這正是本頁存在的主要原因。",
      "K-POP 沒有單一的售票網站。平台是由經紀公司與主辦單位「每一次巡迴」各自決定的，並且會寫在該場次的官方公告裡。其餘的一切——你會遇到哪種身分驗證、海外信用卡能不能用、先行販售提前多久——都由這一件事決定。",
      "所以順序是：先找到官方公告，確認平台，然後針對那個平台的要求做準備。反過來做，就是在開賣前一小時發現自己在錯的網站上完成了驗證。",
    ],
    steps: [
      {
        title: "找官方公告，不要看粉絲轉發",
        body: "去藝人的官方管道——經紀公司網站、藝人的 Weverse 社群、官方 X 與 Instagram。公告會寫明售票平台、先行與一般販售的時間（以 KST 標示）、先行所需的會員等級，以及居住地或驗證條件。請截圖保存。接下來的每一步都取決於這一份文件。",
        pitfall:
          "粉絲帳號會彙整與改寫資訊，平台寫錯的情況足以讓你錯過開賣。日期變動時也很少更新。",
        takes: "10 分鐘",
      },
      {
        title: "確認平台——不要從公司名推測",
        body: "HYBE 旗下的藝人多半走 Weverse 自家的售票。其他韓國巡迴常見的是 NOL Ticket（韓文站）或 NOL World（其海外版）、YES24、Melon Ticket。但這是傾向而非規則：經紀公司會在不同巡迴之間更換平台，同一個巡迴也可能把韓國場與全球場分到兩個不同網站。請讀公告。",
        pitfall:
          "把對應關係當成固定的——「HYBE 就是 Weverse、SM 就是 YES24」——是現有指南中最常見的錯誤，而且錯的頻率高到不能忽略。",
        takes: "5 分鐘",
      },
      {
        title: "搞清楚你會遇到哪一種身分驗證",
        body: "韓文售票網站大多以韓國手機號碼進行本人驗證，而取得該號碼實務上需要韓國的居留文件。如果你沒有，韓文網站就不是你的路線。海外版網站正是為這種情況而存在，並以其他方式驗證——通常是與帳號綁定的護照資料。現在就決定要用哪一個網站，因為你需要的帳號在那個網站上。",
        pitfall:
          "硬要讓韓文網站通過是白費力氣。而借用他人身分來通過驗證這類安排，本站不會協助——那會讓你的門票與帳號同時陷入風險。",
        takes: "15 分鐘",
      },
      {
        title: "用護照上的資料完全一致地建立帳號",
        body: "姓名請使用護照機讀區上的法定姓名，出生日期依網站要求的格式輸入。若該場次的先行販售需要後援會會員資格，會員資料與售票帳號上的姓名和出生日期必須一致。資料不符是訂單在入場或驗證時被取消的已記錄原因。",
        pitfall:
          "中間名、帶連字號的姓氏、姓名順序是出錯的地方。會員資料寫「Maria Santos」而護照是「Maria Elena Santos Cruz」，這就是不符。",
        takes: "20 分鐘",
      },
      {
        title: "付款方式請提前幾天確認，不要等到當天",
        body: "海外發行的卡片通常可以使用，但往往要等帳號完成海外顧客驗證之後。另外，你的銀行可能會擋下第一次來自韓國商家的扣款，而 3-D Secure 驗證在 App 內建瀏覽器中也常失敗。打電話給銀行開通海外交易；如果平台有可測試的流程，先完成一筆無關的小額付款。",
        pitfall:
          "在付款階段被拒絕，你保留的座位會在幾分鐘內回到票池。這是整個流程中代價最高的失敗，也是完全可以避免的失敗。",
        takes: "預留 1～3 天",
      },
      {
        title: "為開賣本身做好準備",
        body: "登入，並在前一天之前完成所有驗證步驟。當天請提早登入，並以官方的 KST 時間為準，而不是你裝置上的時鐘。事先決定好想要的座位——多數排隊系統只給你很短的時間選位與付款，逾時就釋出。",
        pitfall:
          "為了「保險起見」開一個新的無痕視窗，等於要在排隊中重新登入與重新驗證。不要這樣做。",
        takes: "開賣前 30 分鐘",
      },
      {
        title: "在考慮轉售之前，先了解轉售規定",
        body: "南韓以《公演法》修正案加強了門票轉售的規範，並於 2026 年 8 月 28 日施行——1 月修正、2 月公布、8 月下旬起生效。相關報導指出，該法禁止以高於購買價格的慣常性或營業性轉售，範圍及於以轉售為目的的購買，且不再限於使用自動化程式的購買。報導提及的罰則包括最高達售價五十倍的罰金與沒收所得。對韓國場次而言，請把高於票面價的轉售視為不存在的選項；若該場次提供官方轉售或讓渡功能，請使用它。",
        pitfall:
          "這是 2026 年 8 月才施行的新法，「慣常性」的認定在實務上尚未確立。國際轉售平台上存在某筆刊登，並不能說明你買賣它是否安全。",
        takes: "5 分鐘",
      },
    ],
    faq: [
      {
        q: "如果會員資格在先行販售前到期，來得及續訂嗎？",
        a: "只有在續訂於資格截止日之前生效才算數，而那個截止日通常比先行販售本身更早。Weverse Shop 的自動付款（自 2026 年 9 月 3 日起於支援的會員資格上提供）會在有效期間的最後一天向已登錄的付款方式扣款，等於完全消除空窗。請在巡迴公布之前就設定好，而不是之後。",
      },
      {
        q: "購買 K-POP 演唱會門票需要韓國電話號碼嗎？",
        a: "就韓文售票網站而言，本人驗證大多依賴韓國手機號碼，而取得該號碼通常需要韓國居留文件。海外版網站一般不需要——它們以其他方式驗證海外顧客，通常是護照資料。你屬於哪一種，取決於你的場次在哪個平台販售。",
      },
      {
        q: "可以使用海外信用卡嗎？",
        a: "在海外版平台上通常可以，而且往往要等帳號完成海外顧客驗證之後。請預期另一半問題出在自己的銀行：事先開通海外交易，並準備好通過 3-D Secure 驗證。",
      },
      {
        q: "後援會先行販售比一般販售早多久？",
        a: "依場次而異，唯一可靠的答案是官方公告。先行通常比一般販售早一天以上，而會員資格通常必須在更早的截止日之前有效。不要用上一次巡迴來推測。",
      },
      {
        q: "韓國站和全球站是同一個排隊嗎？",
        a: "不一定。同一場次的韓文販售與全球販售，在配票、驗證與後援會資格認定上可能分開處理。在其中一邊完成的驗證，不保證另一邊也承認，所以請依公告確認哪一邊適用於你。",
      },
    ],
    labels: ZH_LABELS,
  },
  {
    locale: "zh-Hant",
    slug: "nol-world-ticketing-guide",
    sourceChecked: "2026-10-14",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "NOL World 購票：那個曾經叫做 Interpark Global 的網站",
    summary:
      "就是以前的 interpark Global。它在 2025 年 12 月 1 日改名，多數指南仍把你導向舊名稱，以下是目前的流程。",
    scope:
      "涵蓋韓國演出的海外版平台。韓文的 NOL Ticket 是另一個產品，帳號系統不同，身分驗證也更嚴格。",
    intro: [
      "兩次改名發生在相近的時間，而網路上幾乎所有英文指南都沒有反映其中任何一次。Yanolja Core 在 2025 年 4 月把旗下品牌整合到 NOL 之下，Interpark Ticket 於此時變成 NOL Ticket。接著在 2025 年 12 月 1 日，海外版的 interpark Global 變成了 NOL World。",
      "實務上的結果是：那些叫你去「Interpark Global」的指南，以及它舊介面的截圖，描述的是一個已經改名並重新設計過的產品。如果你照著那種指南走，等於拿著過期的地圖。",
      "本頁追蹤的是目前這張地圖。頁面上方的日期，是我們最後一次查核的日子。",
    ],
    steps: [
      {
        title: "從海外版網站開始，不是韓文版",
        body: "NOL World 是海外粉絲的入口。韓文的 NOL Ticket 執行較嚴格的國內身分驗證，除非你持有韓國居留文件，否則一般不是你的路線。兩者是分開的帳號，在其中一邊註冊不會讓你取得另一邊。",
        pitfall:
          "搜尋結果與舊書籤至今仍會指向先前的品牌名稱。在花時間建立帳號之前，先確認你在海外版網站上。",
        takes: "5 分鐘",
      },
      {
        title: "以護照上的資料註冊",
        body: "姓名與出生日期請使用護照上印的法定資料。若你想看的場次有後援會先行，這些資料也必須與會員紀錄一致。任何不符請在先行開放之前修正，而不是在進行中。",
        pitfall:
          "事後更改已驗證的姓名是客服申請流程，不是設定切換。第一次就填對。",
        takes: "20 分鐘",
      },
      {
        title: "在需要用到之前完成海外顧客驗證",
        body: "海外顧客驗證是每個帳號一次性的程序，NOL World 明確表示已驗證的資料無法重複使用。請在你實際要購買的帳號上完成——若你有多個帳號，驗證不會轉移。刪除帳號確實會一併清除其驗證資料並釋出給另一個帳號使用，但因濫用而被限制的帳號根本無法刪除。驗證本身沒有年齡限制，不過有年齡限制的場次仍可能拒絕訂購。完成通知以電子郵件寄出，所以在判斷失敗之前請先檢查垃圾郵件。",
        pitfall:
          "在付款階段才發現驗證仍在處理中，是失去已保留座位的典型途徑。",
        takes: "含處理時間 1～3 天",
      },
      {
        title: "在場次頁面確認該場的條件",
        body: "每個帳號可購買的座位數、是否需要會員資格、現場的證件要求，以及該場次是否開放給海外購買者，都是逐場設定的。請同時閱讀場次頁面與官方公告；兩者不一致時，以你那一場的官方公告為準。",
        pitfall:
          "有些場次會把特定座位區或販售輪次限定給國內購買者。這是逐場的情況，無法從一般性的指南得知。",
        takes: "10 分鐘",
      },
      {
        title: "領票時帶上正確的文件",
        body: "領票地點是演出當天的場館售票口，而且不能更早——NOL World 表示無法在演出日之前領取。窗口於開演前一小時開放，你需要訂位編號與身分證件。請預留售票口本身也會排隊的時間。票一旦領取，遺失或遭竊都不會補發。",
        pitfall:
          "訂位上的姓名、證件上的姓名、會員紀錄上的姓名必須全部一致。這條鏈上任何一處出現暱稱都是問題。",
        takes: "—",
      },
    ],
    faq: [
      {
        q: "NOL World 和 Interpark Global 是同一個嗎？",
        a: "是品牌更名後的同一個海外售票服務。interpark Global 於 2025 年 12 月 1 日更名為 NOL World，延續 Yanolja Core 在 2025 年 4 月把品牌整合到 NOL 之下、Interpark Ticket 改為 NOL Ticket 的那一波。",
      },
      {
        q: "為什麼我的舊書籤還是顯示 Interpark？",
        a: "品牌更名要滲透到搜尋結果、第三方指南與快取頁面需要時間。請從你那一場的官方公告出發，而不是從儲存的連結或部落格文章。",
      },
      {
        q: "NOL Global 是同一個嗎？NOL Korea 呢？",
        a: "這些是人們在半記得改名這件事時會想到的名稱，而且值得說清楚，因為那正是被輸入的字。網站有兩個：海外版的 NOL World，在 2025 年 12 月 1 日之前叫 interpark Global；以及韓文版的 NOL Ticket，在 2025 年 4 月之前叫 Interpark Ticket。如果你是被導向「NOL Global」「NOL Korea」或「NOL KR」，你要找的幾乎肯定是 NOL World。",
      },
      {
        q: "NOL Ticket 的帳號可以在 NOL World 使用嗎？",
        a: "請當成兩個獨立的帳號與獨立的驗證。不要假設登入或已完成的驗證會延續——請在你實際購買的那個網站上確認。",
      },
    ],
    labels: ZH_LABELS,
  },
  {
    locale: "zh-Hant",
    slug: "foreign-card-declined-korean-ticketing",
    sourceChecked: "2026-10-14",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "為什麼你的卡片在韓國售票網站被拒絕",
    summary:
      "有三套不同的系統可以拒絕同一筆付款——售票平台、你的卡組織，以及你的銀行。每一個的解法都不一樣，而其中只有一個是快的。",
    scope:
      "涵蓋在韓國售票平台上使用海外發行卡片付款的情況。本頁不是財務建議，也無法涵蓋你自己銀行的規則。",
    intro: [
      "在付款步驟被拒卡，是 K-POP 購票流程中代價最高的失敗，因為被保留的座位會在幾分鐘內回到票池。而這幾乎都可以靠提前準備避免。",
      "它之所以讓人覺得毫無規律，是因為有三套彼此獨立的系統可以拒絕同一筆交易，而你看到的錯誤訊息很少告訴你是哪一個拒絕的。請依照「各自需要多久才能解決」的順序逐一排除。",
    ],
    steps: [
      {
        title: "先確認你的帳號驗證是否真的已經完成",
        body: "在好幾個平台上，海外發行的卡片只有在帳號完成海外顧客驗證之後才能使用。如果驗證仍在處理中，卡片狀態再怎麼正常也一樣會失敗。這是最慢才能解決的一項，所以排在第一位。",
        pitfall:
          "付款錯誤訊息不會寫「你的驗證尚在處理中」。它看起來就只像是卡片有問題。",
        takes: "1～3 天",
      },
      {
        title: "在開賣之前就通知銀行，而不是之後",
        body: "請開通海外與線上交易；如果你的銀行支援，也可以事先針對金額區間與國家做預先授權。一筆來自韓國商家、發生在不尋常時段的首次扣款，正是風控系統會擋下的典型樣貌。",
        pitfall:
          "自動風控的封鎖在你這一側往往是無聲的——沒有簡訊，也沒有 App 通知。你只會從商家那邊收到一句籠統的「交易被拒」。",
        takes: "1 天",
      },
      {
        title: "不要在 App 內建瀏覽器裡完成付款步驟",
        body: "3-D Secure 與銀行的一次性密碼流程，在社群或通訊軟體內建的瀏覽器中經常失效。請使用一般的手機或桌機瀏覽器，並確認你能在同一台裝置上收到銀行的驗證訊息。",
        pitfall:
          "轉導頁面可能看起來成功了，實際上卻靜靜地丟掉了授權，而這在你眼中就是一次拒卡。",
        takes: "0 分鐘，只要做對就好",
      },
      {
        title: "準備一張真正不同的備用卡，不是同一家的另一張",
        body: "同一家發卡機構的第二張卡，通常會因為同樣的理由失敗。不同發卡機構、不同卡組織，或平台提供的其他支援付款方式，才算真正的備案。另外，兩個海外平台拒絕的東西恰好相反，在怪卡片之前值得先知道：NOL World 接受 VISA、MasterCard、AMEX、JCB 與 UnionPay，但僅限在韓國境外發行，並且直接拒絕韓國發行的卡片。YES24 Global 在其中兩項上反其道而行，排除在韓國境外發行的 American Express，並完全排除 UnionPay。在一邊被拒的卡片，可能正是另一邊該用的卡片。",
        pitfall:
          "就風控規則而言，同一家銀行的兩張卡等於一張卡。",
        takes: "設定約 30 分鐘",
      },
      {
        title: "在確認之前看清幣別與金額",
        body: "請確認自己是以 KRW 計價，還是以換算後的金額扣款，並了解自己卡片的國外交易手續費。換算後的金額若超過你自己設定的額度上限，同樣會造成拒卡。",
        pitfall:
          "動態貨幣轉換會悄悄增加成本。以 KRW 付款通常是比較便宜的選擇。",
        takes: "5 分鐘",
      },
    ],
    faq: [
      {
        q: "我的卡明明有餘額，為什麼被拒絕？",
        a: "最常見的是三件事之一：你的平台帳號尚未完成海外顧客驗證；你的銀行風控系統擋下了一個不熟悉的國外商家；或是 3-D Secure 這一步失敗了——通常是因為它在 App 內建瀏覽器中執行。拒絕訊息一般不會區分這三者。",
      },
      {
        q: "PayPal 可以用嗎？",
        a: "部分面向海外的平台在部分場次支援其他付款方式。這是按平台、按場次設定的，而不是全面通用，所以在把計畫押在它上面之前，請先確認你那一場頁面上列出的付款選項。",
      },
      {
        q: "我該以 KRW 付款，還是以自己的幣別付款？",
        a: "以商家的幣別付款通常比讓付款頁面幫你換算更便宜，因為動態貨幣轉換會加上一層匯差。不論選哪一種，你自己卡片的國外交易手續費依然會收。",
      },
    ],
    labels: ZH_LABELS,
  },
  {
    locale: "zh-Hant",
    slug: "buy-k-pop-albums-from-overseas",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "從海外購買 K-POP 專輯，而且要能被計入",
    summary:
      "你在哪裡買，決定了這筆購買會不會被計入、運費付多少，以及能不能拿到預購贈品。以下是選擇的方法。",
    scope:
      "涵蓋購買官方實體專輯與周邊並寄送到韓國境外的情況。不涵蓋二手轉售平台或非官方商品。",
    intro: [
      "和門票不同，這個問題全年都在發生——這也是它被放在門票旁邊的原因。而同樣和門票不同的是，它有一個錯誤答案，而且錯了也看不出代價：專輯照樣送到你手上，只是沒有被計入。",
      "會因為購買地點而不同的有三件事：這筆銷售有沒有被回報給韓國排行榜、預購贈品有沒有跟著來，以及把運費與關稅算進去之後的實際到手成本。這三件事不會同進同退，所以最便宜的選項經常就是那個什麼都不計入的選項。",
    ],
    steps: [
      {
        title: "先決定你真正想從這筆購買得到什麼",
        body: "排行榜貢獻、實體專輯本身、預購贈品，還是最低價格。這幾個方向會互相拉扯。請在挑店家之前先決定優先順序，因為店家是由它決定的。",
        pitfall:
          "為了省錢在綜合購物平台下單，然後才發現它不被計入，這是這個錯誤最標準的版本。",
        takes: "5 分鐘",
      },
      {
        title: "確認賣家是否會回報給韓國排行榜",
        body: "回報給韓國專輯排行榜的銷售，來自特定的零售商與官方商店。一個商品是正版專輯，並不代表這筆銷售被回報了。如果排行榜貢獻正是你購買的理由，請在下單之前先確認該零售商屬於會回報的那一類。",
        pitfall:
          "第三方平台上的正版專輯商品，通常不會被計入。專輯是真的，貢獻不在那裡。",
        takes: "15 分鐘",
      },
      {
        title: "在預購期間內下單，才拿得到贈品",
        body: "預購特典——海報、額外的小卡、活動抽選資格——綁定的是「在某段期間內下單」，而且往往綁定那一家特定零售商。那段期間在發行日之前就結束，不是在發行日當天。",
        pitfall:
          "各零售商的獨家贈品並不互通。在別家買同一張專輯，拿到的是另一組贈品，或者什麼都沒有。",
        takes: "10 分鐘",
      },
      {
        title: "要估的是運費與關稅風險，不是專輯價格",
        body: "從韓國寄出的運費可能超過專輯本身的價格，而你是否還要另外付進口稅費，取決於你自己國家的規則。請現在就去確認，而不是憑印象假設：美國在 2025 年 8 月暫停了 800 美元的免稅門檻，歐盟也在 2026 年 7 月 1 日取消了 150 歐元的門檻，所以對這兩地的讀者而言，已經不存在「小到可以免稅入境」的金額。合併訂單可以降低每件商品的運費。請在下單之前把到手成本算出來。",
        pitfall:
          "照著一個在你所在地已經不存在的免稅額度做規劃。而在仍然存在免稅額度的地方，把好幾張專輯併成一個包裹，可能讓申報價值超過門檻，反而比分開寄更貴——兩種算法都算一次。",
        takes: "20 分鐘",
      },
      {
        title: "在收到之前保留訂單紀錄",
        body: "請保存訂單確認、追蹤號碼與申報價值。任何環節出問題——包裹破損、海關查詢、贈品缺漏——這些都是零售商會向你索取的東西。",
        pitfall:
          "韓國零售商的客服經常是以訂單編號查詢，而不是用電子郵件找。沒有編號，對話會很慢。",
        takes: "5 分鐘",
      },
    ],
    faq: [
      {
        q: "在韓國以外購買的專輯，會被計入韓國排行榜嗎？",
        a: "由參與回報的零售商所回報的銷售會被計入，而這取決於零售商，而不是取決於你所在的地點。在不回報的店家買到正版專輯，意思是專輯是真的，但這筆銷售沒有被計入。如果排行榜貢獻就是重點，請在下單前先確認零售商。",
      },
      {
        q: "合併訂單值得嗎？",
        a: "就運費而言通常值得，因為每件商品的分攤成本會明顯下降。但要與你所在國家的進口規則一起衡量——在仍有免稅額度的地方，單一個高價值包裹可能被課稅，而分開的幾個小包裹不會。在美國與歐盟，這個算法已經變了：兩者都取消了低價值免稅，所以已經沒有門檻可以躲在下面。",
      },
      {
        q: "為什麼各家店的預購特典不一樣？",
        a: "零售商各自談自己的獨家贈品，所以同一張專輯會因為在哪裡預購而附上不同的額外內容。如果你想要的是某個特定贈品，就必須在提供它的那家店、在它的期間內下單。",
      },
    ],
    labels: ZH_LABELS,
  },
  {
    locale: "zh-Hant",
    slug: "order-from-weverse-shop-overseas",
    sourceChecked: "2026-10-21",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "在韓國以外下單 Weverse Shop",
    summary:
      "你身處哪一個商店、為什麼結帳時價格會變、你的幣別實際上能用哪些付款方式，以及韓國無法寄送的國家。",
    scope:
      "涵蓋從韓國出貨的實體周邊與專輯的 Weverse Shop 下單流程。會員資格購買與售票另有處理，收錄在先行販售指南中。本頁的規則來自 Weverse Shop 自己的公告，而且變動時不太會事先預告。",
    intro: [
      "幾乎每一份英文的 Weverse Shop 指南至今仍寫著全球商店只接受 PayPal 或 Eximbay，別無其他。那在好幾年前是對的。付款方式的清單現在長得多，它是由你帳號所設定的幣別決定，而不是由你居住的國家決定；而且自 2026 年 2 月起，商品頁上的價格不是你實際支付的價格。",
      "這些都不是什麼秘密——它們就寫在商店自己的公告裡，而以下內容全部出自那裡。只是寫那些指南的人，沒有人真的去讀過。",
    ],
    steps: [
      {
        title: "先搞清楚你實際上在哪一個 Weverse Shop",
        body: "Weverse Shop 不是一間店。有一個 GLOBAL 商店，也有各個地區商店，它們的庫存不同、預購期間不同、出貨地點也不同。你看到別人下單的某個商品，在你的商店裡可能根本不存在。在你照著某個發行日做規劃之前，先確認自己在哪一個商店，因為某一間店的預購截止時間，對其他店完全沒有參考價值。",
        pitfall:
          "別人在粉絲社群分享的連結，打開的是他們的商店，不是你的。如果頁面載入得開、商品卻加不進購物車，通常是你在錯的商店，而不是你太晚了。",
        takes: "2 分鐘",
      },
      {
        title: "在你看任何東西之前先設定幣別",
        body: "你的預設幣別決定了你會被提供哪些付款方式。Weverse 依幣別列出如下：USD 可用 PayPal、Eximbay、Alipay+、Apple Pay、WeChat Pay 與 Grab Pay。JPY 是同一份清單，但沒有 Grab Pay。CNY 少了 PayPal。MXN 只有 PayPal 與 Apple Pay。KRW 則加上韓國信用卡與韓國電子錢包——Toss、NAVER Pay、Kakao Pay、PAYCO。MXN 是韓國以外四份清單裡最短的一份，也是最值得預先準備的一份：兩種方式，都是電子付款，沒有現金選項。兩種都沒準備好，結帳頁就沒有第三個按鈕。",
        pitfall:
          "在 KRW 以外的幣別上，沒有單純的「用 Visa 付款」這個選項。你的卡片是透過 PayPal 或 Eximbay 走的，而對你的銀行而言，那是一筆性質不同於韓國商家扣款的交易——這也正是一張在別處能用的卡，在這裡依然可能失敗的原因。",
        takes: "3 分鐘",
      },
      {
        title: "預期結帳時價格會上升，並且知道為什麼",
        body: "自 2026 年 2 月 3 日起，Weverse 依你的收件地址與帳單地址計算稅額。寄往韓國的訂單，全程顯示含稅價格。寄往其他任何地方的訂單，商品頁顯示的是未稅價格，而目的地的稅額會在你輸入地址之後、於結帳時加上。商品頁上的數字不是你要付的數字，而這是刻意設計，不是故障。",
        pitfall:
          "這看起來完全像是詐騙或程式錯誤，而這也正是人們放棄訂單的那個時間點。增加的金額就是你自己國家課的稅，只是提前收取，而不是之後由海關來收。",
        takes: "1 分鐘",
      },
      {
        title: "請填寫帳單地址，不只是收件地址",
        body: "同一次 2026 年 2 月的變更在結帳頁加上了帳單地址欄位，因為稅額計算需要它。對某些無形商品——數位商品與內容——帳單地址可能是必填而非選填。請準確填寫：稅率是從它算出來的，而填錯之後並不是你能事後悄悄改掉的東西。",
        pitfall:
          "把收件地址直接複製到帳單地址欄位，在兩者相同時沒問題，在兩者不同時就是錯的。如果你的卡片登記在另一個地址，就填那一個。",
        takes: "2 分鐘",
      },
      {
        title: "確認地址的書寫語言符合目的地要求",
        body: "Weverse 請海外顧客在輸入地址之前，先確認目的地國家需要以哪一種語言填寫地址。反方向的規則更明確：寄往南韓的訂單，地址必須以韓文書寫，因為物流業者可能不接受英文地址，或是在處理時出錯。至於其他所有地方，請依你自己國家郵政體系所期望的格式書寫。",
        pitfall:
          "把韓文地址音譯成英文，是寄往韓國的訂單延誤或投遞失敗最常見的單一原因。",
        takes: "5 分鐘",
      },
      {
        title: "確認韓國能不能寄到你那裡",
        body: "從南韓出貨無法寄達的國家與地區，由 Weverse 維護一份清單並持續更新。在 2026 年 7 月 15 日修訂的版本中，清單包含緬甸、剛果民主共和國、伊拉克、伊朗、黎巴嫩、馬利、俄羅斯、安道爾、烏克蘭、白俄羅斯、阿富汗、荷屬安地列斯、以色列與土耳其。這份清單會變動，所以請看公告，而不是看本頁。",
        pitfall:
          "這份清單被描述為暫時性的運送中斷，而非政策，意思是一個國家既可能被加進去，也可能被移出。先前成功下單過，或朋友去年下單過，都不能說明你今天能不能下單。",
        takes: "2 分鐘",
      },
      {
        title: "如果在意贈品，就要在預購期間內下單",
        body: "預購特典——那些海報、小卡與初回盤贈品，通常正是人們選擇在官方商店而非更便宜的地方下單的理由——綁定的是預購期間，而不是那張專輯。期間一結束，同一張專輯就不附這些東西出貨。如果贈品才是重點，該圍繞著規劃的是截止時間，而不是發行日。",
        pitfall:
          "預購期間是在韓國的某個時刻結束，而對本站多數讀者所在的地方來說，那是前一天的傍晚或凌晨。",
        takes: "在截止之前",
      },
    ],
    faq: [
      {
        q: "在 Weverse Shop 可以用 Visa 或 Mastercard 付款嗎？",
        a: "在韓國幣別設定以外，不能作為直接的信用卡選項。在 USD、JPY、CNY 與 MXN 上，卡片是透過 PayPal 或 Eximbay 走的。那依然會扣到你的卡，但你的銀行看到的是另一種類型的交易，所以事先開通海外付款是值得做的。",
      },
      {
        q: "為什麼我輸入地址之後價格變高了？",
        a: "自 2026 年 2 月 3 日起，韓國以外的價格在商品頁上以未稅顯示，而你目的地的稅額會在結帳時加上。那是你自己國家課的稅，在購買時收取，而不是在送達時收取。",
      },
      {
        q: "東西送到時我會被收關稅嗎？",
        a: "Weverse 現在會在符合條件的訂單上於結帳時預繳關稅與稅費，並表示這可以減少在通關過程中額外付款的需要。它也說明這並不適用於每一個國家或地區，所以這是一個合理的預期，而不是保證。",
      },
      {
        q: "我在墨西哥。實際可以用的付款方式有哪些？",
        a: "兩種。Weverse 的付款說明把 MXN 列為 PayPal 與 Apple Pay，是韓國以外四種幣別清單中最短的一份，而且兩種都是電子付款。沒有現金選項，也沒有第三個按鈕，所以請在預購開賣之前就把其中一種準備好，而不是在開賣當下才弄。",
      },
      {
        q: "Weverse Shop 寄送到我的國家嗎？",
        a: "通常會，但有一份維護中的國家與地區清單目前無法接收從南韓寄出的貨物。請在下單之前查看該公告上的現行清單——它會隨著情況變化而修訂。",
      },
    ],
    labels: ZH_LABELS,
  },
  {
    locale: "zh-Hant",
    slug: "nol-world-verified-member-ekyc",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "NOL World Verified Member：從海外通過 eKYC 身分驗證",
    summary:
      "有些場次在你的護照通過驗證之前，根本不讓你訂票。這項檢查是護照與人臉的即時拍攝，無法隨意重做，而 NOL World 關於時機所給的唯一一句指示，正是多數人會忽略的那一句。",
    scope:
      "涵蓋 NOL World 上的 Verified Member Only 身分檢查，依 NOL World 自己的說明：何時適用、拍攝需要什麼、它所儲存的姓名會怎麼處理，以及什麼會重置或限制它。持韓國護照者被導向 NOL Ticket，那是另一個網站上的另一種檢查。本頁沒有任何繞過驗證的方法。",
    intro: [
      "Verified Member Only 的場次，是在你的身分完成驗證之前根本無法訂票的場次。不是結帳時跳出的警告——而是這個預約對未驗證的帳號來說就是不存在。粉絲往往在開賣的那一刻才發現這件事，而那是最糟的時間點，因為驗證是對你的護照與你的臉做即時拍攝，它需要多少時間就是多少時間。",
      "NOL World 把這項服務說明為限制轉售等未經授權用途的手段。這句話值得照字面接受：這項檢查的存在，是為了把一個人綁在一個帳號上，而以下幾乎每一條規則都是由此衍生出來的。",
    ],
    steps: [
      {
        title: "確認你的場次是否需要它，以及你是否在對的網站上",
        body: "Verified Member Only 是逐項商品設定的，不是逐個帳號——NOL World 表示，只有在商品頁上完成身分驗證的會員才能進行預約。所以第一個問題是，你的場次究竟有沒有掛上這個標記。第二個問題是，你該不該待在 NOL World：NOL World 告訴持韓國護照者改用 NOL Ticket 網站，而那上面跑的是完全不同的一套檢查。",
        pitfall:
          "以為身分檢查是個網站會提醒你去做的一次性瑣事。對 Verified Member Only 的場次而言，沒有提醒——預約就只是不在那裡。",
        takes: "10 分鐘",
      },
      {
        title: "在開賣前一到兩天完成它",
        body: "這是 NOL World 自己的指示，也是本頁最有用的一個事實：請至少提前一到兩天完成驗證，因為在接近開賣時間時嘗試，大量流量可能造成困難。一旦完成，你就能訂任何 Verified Member Only 的場次，不需要再驗證一次。提早做的代價是一個晚上。太晚做的代價是那場演出。",
        pitfall:
          "在先行販售前十分鐘才開始拍攝。一個因為流量而失敗的驗證無法催快，而排隊不會等你。",
        takes: "提前兩天，30 分鐘",
      },
      {
        title: "驗證你實際上要用來購買的那個帳號",
        body: "驗證是每個帳號一次性的，而 NOL World 表示已驗證的資料無法重複使用——一本護照驗證一個帳號。如果你有超過一個帳號，現在就是決定哪一個才是你真正要用的時候，因為驗證之後它不會再搬家。NOL World 補充說，刪除帳號會清除其驗證資料並釋出給另一個帳號使用，但因濫用而被限制的帳號根本無法刪除。",
        pitfall:
          "在剛好登入著的那個帳號上完成驗證，然後用另一個帳號去買。第二個帳號是未驗證的，而那場演出是 Verified Member Only。",
        takes: "5 分鐘的決定",
      },
      {
        title: "準備護照正本，且在有效期限內",
        body: "只接受有效護照，而 NOL World 明確表示照片或影本都不行：不是列印的掃描檔，不是螢幕截圖，也不是用另一個螢幕翻拍的護照頁。如果你的護照已經過期，就必須先換發才能驗證——在 NOL World 上，非韓國護照持有者沒有其他替代文件的路線。",
        pitfall:
          "因為護照正本放在飯店保險箱，就拿手機相簿裡現成的護照照片頂替。那一次嘗試會被記錄為一次使用影本的嘗試。",
        takes: "—",
      },
      {
        title: "第一次就把拍攝做過",
        body: "NOL World 公開了哪些情況會導致拍攝失敗，而那份清單讀起來就像是一份「人在匆忙時會做的事」清單。請把護照與你的臉對齊螢幕上的引導框。別讓反光與眩光落在護照頁與你的臉上。你的臉必須與護照上的照片相符。拍攝時請把裝置穩穩握住至少五秒。而如果裝置規格偏低或網路不穩，即使拍攝看起來正常，資料也可能沒有正確儲存。失敗時螢幕會顯示原因——請讀它，不要盲目重試。",
        pitfall:
          "在夜裡、單手、在一盞會反射在壓膜上的天花板燈下做這件事。護照頁上方的頂光，是拍攝讀不出來最常見的原因。",
        takes: "15 分鐘",
      },
      {
        title: "檢查實際被儲存下來的姓名",
        body: "只接受英文姓名。NOL World 表示，如果你的護照姓名不是英文或含有特殊字元，預約將無法進行，而你可能會被導向姓名更正申請——那是一項申請，不是設定裡的切換。被儲存的姓名可以在 My Page 上看到，請去那裡確認，而不是憑假設。這一點現在很重要，因為驗證之後你完全無法修改姓名、出生日期或電子郵件地址：預約只能以已驗證的資料進行。",
        pitfall:
          "因為驗證顯示成功就不去檢查姓名。成功與存對字元是兩件不同的事，而其中一件已經不能再編輯了。",
        takes: "5 分鐘",
      },
      {
        title: "了解姓名順序——以及在入場時真正重要的是什麼",
        body: "NOL World 在 2025 年 4 月 16 日變更了儲存的姓名順序。在該日期之前完成驗證的會員，資料是名 +（中間名）+ 姓；在該日期之後完成驗證的會員，則是姓 + 名 +（中間名）。NOL World 明確表示，即使順序與你的護照不同，票券驗證與在場館入場仍然可行——現場驗證只有在姓名本身與護照姓名不同時才會受限。在 2025 年 4 月 16 日之前完成驗證的會員，會在護照到期後重新驗證時套用新格式。",
        pitfall:
          "因為順序看起來不對就提出姓名更正申請。NOL World 說順序不是問題；姓名不同才是。要對的是字元，不是順序。",
        takes: "5 分鐘",
      },
      {
        title: "了解什麼會推翻你已經通過的驗證",
        body: "已完成的驗證在事後仍可能被取消。NOL World 列出兩個原因：以偽造或變造的證件嘗試驗證——而它把列印影本與螢幕截圖都定義在內——以及用於驗證的護照過期。如果你的驗證被取消，請使用既有帳號重新驗證。NOL World 特別警告，改用新帳號可能導致系統反覆失敗，而被認定以不正當手段取得的驗證，可能讓你失去使用訂票服務的權限。",
        pitfall:
          "開一個新帳號來躲避重置。重置跟著的是那份文件，不是那個帳號，而新帳號會把問題連同懷疑一起繼承過來。",
        takes: "—",
      },
      {
        title: "了解平台把什麼當成詐欺，以及代價是什麼",
        body: "這項檢查之所以這麼嚴，原因寫在 NOL World 的反詐欺政策裡，而後果是公開的。使用被竊或偽造的證件進行驗證，被列為不正當使用。以相同或相似的個人資料超出正常使用範圍訂購多張門票也是——跨帳號使用相同的聯絡資料、收件地址或付款資訊。罰則從三個月以上的訂票限制，一路到永久停權並取消所有已訂門票。主辦單位可能再加上自己的罰則，包括逐出後援會。申訴管道是有的；而在不正當交易被明確認定的情況下，沒有。",
        pitfall:
          "用一支手機、一個地址、一張卡去驗證好幾個家人的帳號，以提高先行販售的中選機率。那個模式就在公開的清單上，而所述罰則會觸及那些帳號上的每一張門票。",
        takes: "10 分鐘的閱讀",
      },
    ],
    faq: [
      {
        q: "Verified Member Only 在場次頁面上實際代表什麼？",
        a: "代表這場演出對未驗證的帳號關閉。NOL World 把它描述為一項讓會員在購買前驗證身分的服務，其中只有在商品頁上完成驗證的會員才能進行預約。它說明目的是限制轉售等未經授權的用途。請把護照與智慧型手機都準備好，因為這項檢查兩者都需要。",
      },
      {
        q: "我持韓國護照。我可以直接在 NOL World 上驗證嗎？",
        a: "NOL World 告訴持韓國護照者改用 NOL ticket 網站。那是另一個網站、另一套身分檢查——一般是韓國手機認證或 I-PIN——以及另一個帳號。",
      },
      {
        q: "我是住在海外、沒有韓國手機號碼的韓國國民。那該怎麼辦？",
        a: "NOL World 公開了一條文件路線。它把居住海外的南韓公民導向 NOL Ticket，在那裡可以透過手機認證或 I-PIN 驗證身分；若沒有韓國居民登錄號碼且無法使用手機認證，則接受證明在外國民身分的佐證文件——在外國民登錄證明書搭配南韓護照，透過其客服詢問表單連同你的帳號 ID 一併提交。它說該證明書可以透過在外同胞廳線上申請，而在證明書難以取得的情況下，外國人登錄證可能被接受作為替代。它也警告，偽造文件將導致立即限制。",
      },
      {
        q: "身分驗證有年齡下限嗎？",
        a: "NOL World 表示驗證本身沒有年齡限制，但你仍可能無法訂購或參加有年齡限制的商品。完成驗證與符合某一場演出的資格，是兩件不同的事。",
      },
      {
        q: "我 My Page 上的姓名順序和護照不一樣。我會被拒絕入場嗎？",
        a: "NOL World 說不會。它在 2025 年 4 月 16 日變更了儲存順序，並表示即使順序與護照不同，票券驗證與入場仍然可行。現場驗證只有在姓名本身不同時才會受限——所以要檢查的是拼法與字元，不是順序。",
      },
      {
        q: "我驗證之後護照過期了。我需要做什麼嗎？",
        a: "需要。NOL World 把護照過期列為已完成驗證被取消的原因之一，所以換發護照就意味著要重新驗證——在既有帳號上，不是新帳號。如果你是在 2025 年 4 月 16 日之前完成驗證的，這也是新姓名順序被套用到你資料上的時候。",
      },
      {
        q: "如果我的護照過期了，可以用家人的護照驗證嗎？",
        a: "不行，而這是唯一一個有公開後果、而非只有意見的問題。NOL World 把使用被竊或偽造的證件進行驗證，列在它視為不正當使用的行為之中，而所述罰則一路到永久停權並取消所有已訂門票。它也說身分驗證可能在場館進行，並要求你以自己的姓名與帳號訂票，並攜帶有效的附照片身分證件。一張過不了門口的票，不是票。",
      },
      {
        q: "我的帳號被限制了。有申訴管道嗎？",
        a: "NOL World 公開了一條。它表示使用者一般會被給予至少一天的期間提出說明，而申訴應是一份詳細的陳述，包含你被限制的帳號 ID、全名與聯絡資訊，沒有規定的格式或範本，透過其客服詢問表單寄出。審查大約需要 10 到 15 天，結果以電子郵件通知。它也說明了界限：錯過期限或未能澄清疑慮，預約就會被強制取消；而在不正當交易被明確認定的情況下，門票可能被取消且完全沒有申訴。",
      },
    ],
    labels: ZH_LABELS,
  },
  {
    locale: "id",
    slug: "buy-k-pop-concert-tickets-from-overseas",
    sourceChecked: "2026-10-14",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Cara membeli tiket konser K-pop dari luar Korea",
    summary:
      "Pahami gambaran besarnya lebih dulu: platform mana yang menjual konser yang Anda tuju, jenis verifikasi identitas apa yang dijalankannya, dan apa saja yang harus sudah siap sebelum penjualan dibuka.",
    scope:
      "Mencakup konser yang diselenggarakan di Korea Selatan dan platform tiket yang dipakai agensi Korea. Tanggal tur di luar Korea dijual oleh promotor lokal, itu hal yang berbeda, dan aturan di bawah ini tidak berlaku untuknya.",
    intro: [
      "Panduan berbahasa Inggris yang menempati peringkat teratas untuk pertanyaan ini hampir seluruhnya ditulis sebelum Desember 2025, dan mengarahkan Anda ke sebuah situs yang namanya sudah bukan nama itu lagi. Itulah alasan utama halaman ini ada.",
      "Tidak ada satu situs tiket tunggal untuk K-pop. Platformnya ditentukan oleh agensi dan promotor untuk setiap tur, dan selalu dicantumkan dalam pengumuman resmi konser tersebut. Semua hal lain — jenis verifikasi identitas yang akan Anda hadapi, apakah kartu kredit luar negeri bisa dipakai, berapa lama presale dibuka lebih awal — ditentukan oleh satu hal itu.",
      "Jadi urutannya begini: temukan pengumuman resminya, pastikan platformnya, lalu bersiap sesuai syarat platform tersebut. Melakukannya terbalik berarti Anda baru sadar satu jam sebelum penjualan dibuka bahwa Anda sudah menyelesaikan verifikasi di situs yang salah.",
    ],
    steps: [
      {
        title: "Cari pengumuman resmi, bukan repost dari fan",
        body: "Buka kanal resmi artisnya — situs agensi, komunitas Weverse artis tersebut, serta X dan Instagram resmi. Pengumuman akan menyebutkan platform tiketnya, waktu presale dan penjualan umum dalam KST, tingkat keanggotaan yang dibutuhkan untuk presale, serta syarat domisili atau verifikasi. Simpan tangkapan layarnya. Setiap langkah berikutnya bergantung pada dokumen ini.",
        pitfall:
          "Akun fan merangkum dan menulis ulang informasi, dan platform yang salah dicantumkan sudah cukup untuk membuat Anda melewatkan penjualan. Mereka juga jarang memperbarui ketika tanggalnya berubah.",
        takes: "10 menit",
      },
      {
        title: "Pastikan platformnya — jangan menduga dari nama agensi",
        body: "Artis di bawah HYBE umumnya memakai sistem tiket Weverse sendiri. Tur Korea lainnya sering memakai NOL Ticket (situs berbahasa Korea) atau NOL World (versi luar negerinya), YES24, dan Melon Ticket. Tetapi itu kecenderungan, bukan aturan: agensi berpindah platform antar tur, dan satu tur yang sama bisa memisahkan tanggal Korea dan tanggal global ke dua situs yang berbeda. Bacalah pengumumannya.",
        pitfall:
          "Menganggap pemetaan itu tetap — “HYBE berarti Weverse, SM berarti YES24” — adalah kesalahan paling umum di panduan yang ada sekarang, dan cukup sering terjadi sehingga tidak bisa diabaikan.",
        takes: "5 menit",
      },
      {
        title: "Pahami jenis verifikasi identitas yang akan Anda hadapi",
        body: "Sebagian besar situs tiket berbahasa Korea melakukan verifikasi identitas melalui nomor ponsel Korea, dan dalam praktiknya nomor itu menuntut dokumen domisili Korea. Jika Anda tidak memilikinya, situs berbahasa Korea bukan jalur Anda. Situs versi luar negeri ada justru untuk keadaan ini, dan memverifikasi dengan cara lain — biasanya data paspor yang terikat pada akun. Tentukan sekarang situs mana yang akan Anda pakai, karena akun yang Anda butuhkan ada di situs itu.",
        pitfall:
          "Memaksakan diri lolos di situs berbahasa Korea adalah upaya yang terbuang. Dan untuk pengaturan seperti meminjam identitas orang lain agar lolos verifikasi, situs ini tidak akan membantu — itu menempatkan tiket dan akun Anda sekaligus dalam risiko.",
        takes: "15 menit",
      },
      {
        title: "Buat akun dengan data yang sama persis seperti di paspor",
        body: "Gunakan nama resmi seperti tertulis di zona bacaan mesin paspor Anda, dan masukkan tanggal lahir dalam format yang diminta situs. Jika presale konser tersebut menuntut keanggotaan fan club, nama dan tanggal lahir di data keanggotaan dan di akun tiket harus sama. Ketidaksesuaian data adalah penyebab yang terdokumentasi atas pesanan yang dibatalkan saat masuk venue atau saat verifikasi.",
        pitfall:
          "Nama tengah, nama belakang bertanda hubung, dan urutan nama adalah tempat kesalahan terjadi. Data keanggotaan tertulis “Maria Santos” sementara paspor tertulis “Maria Elena Santos Cruz” — itu ketidaksesuaian.",
        takes: "20 menit",
      },
      {
        title: "Pastikan metode pembayaran beberapa hari sebelumnya, bukan di hari-H",
        body: "Kartu yang diterbitkan di luar negeri umumnya bisa dipakai, tetapi sering baru setelah akun Anda menyelesaikan verifikasi pelanggan luar negeri. Selain itu, bank Anda mungkin memblokir tagihan pertama dari merchant Korea, dan verifikasi 3-D Secure sering gagal di dalam peramban bawaan aplikasi. Hubungi bank Anda untuk mengaktifkan transaksi internasional; jika platformnya punya alur yang bisa diuji, selesaikan satu pembayaran kecil yang tidak berkaitan lebih dulu.",
        pitfall:
          "Ditolak di tahap pembayaran berarti kursi yang Anda tahan kembali ke kolam dalam hitungan menit. Ini kegagalan paling mahal dalam seluruh proses, dan sekaligus yang paling bisa dihindari.",
        takes: "Sisakan 1-3 hari",
      },
      {
        title: "Bersiap untuk penjualannya sendiri",
        body: "Masuk ke akun Anda, dan selesaikan semua langkah verifikasi paling lambat sehari sebelumnya. Di hari-H, masuklah lebih awal, dan berpeganglah pada waktu KST resmi, bukan pada jam di perangkat Anda. Tentukan kursi yang Anda inginkan sebelumnya — sebagian besar sistem antrean hanya memberi waktu singkat untuk memilih kursi dan membayar sebelum tahanan itu dilepas.",
        pitfall:
          "Membuka jendela penjelajahan pribadi baru “untuk aman” berarti Anda harus masuk dan memverifikasi ulang di dalam antrean. Jangan lakukan itu.",
        takes: "30 menit sebelum dibuka",
      },
      {
        title: "Pahami aturan penjualan ulang sebelum mempertimbangkannya",
        body: "Korea Selatan memperketat aturan penjualan ulang tiket melalui revisi Undang-Undang Pertunjukan yang berlaku sejak 28 Agustus 2026 — direvisi pada Januari, diumumkan pada Februari, dan berlaku sejak akhir Agustus. Pemberitaan menyebut undang-undang itu melarang penjualan ulang yang bersifat kebiasaan atau komersial di atas harga pembelian, mencakup pembelian yang bertujuan menjual kembali, dan tidak lagi terbatas pada pembelian yang memakai program otomatis. Sanksi yang disebutkan dalam pemberitaan mencakup denda hingga lima puluh kali harga jual dan perampasan keuntungan. Untuk konser di Korea, anggap penjualan ulang di atas harga tiket sebagai pilihan yang tidak ada; jika konser tersebut menyediakan fitur penjualan ulang atau pengalihan resmi, pakailah itu.",
        pitfall:
          "Ini undang-undang baru yang berlaku sejak Agustus 2026, dan dalam praktiknya batasan “bersifat kebiasaan” belum mapan. Keberadaan sebuah penawaran di platform penjualan ulang internasional tidak memberi tahu Anda apakah membeli atau menjualnya aman.",
        takes: "5 menit",
      },
    ],
    faq: [
      {
        q: "Kalau keanggotaan saya habis sebelum presale, apakah masih bisa diperpanjang tepat waktu?",
        a: "Hanya berlaku jika perpanjangan itu aktif sebelum tanggal batas kelayakan, dan tanggal itu biasanya lebih awal daripada presale itu sendiri. Pembayaran otomatis Weverse Shop, yang tersedia untuk keanggotaan yang didukung sejak 3 September 2026, menagih metode pembayaran terdaftar Anda pada hari terakhir masa berlaku, sehingga jeda itu hilang sepenuhnya. Aturlah sebelum tur diumumkan, bukan sesudahnya.",
      },
      {
        q: "Apakah saya perlu nomor telepon Korea untuk membeli tiket konser K-pop?",
        a: "Untuk situs tiket berbahasa Korea, verifikasi identitas umumnya bergantung pada nomor ponsel Korea, dan nomor itu biasanya menuntut dokumen domisili Korea. Situs versi luar negeri umumnya tidak — mereka memverifikasi pelanggan luar negeri dengan cara lain, biasanya data paspor. Yang mana yang berlaku untuk Anda bergantung pada platform mana yang menjual konser Anda.",
      },
      {
        q: "Bisakah saya memakai kartu kredit luar negeri?",
        a: "Di platform versi luar negeri umumnya bisa, dan sering baru setelah akun Anda menyelesaikan verifikasi pelanggan luar negeri. Siapkan diri bahwa separuh masalah lainnya ada di bank Anda sendiri: aktifkan transaksi internasional lebih dulu, dan pastikan Anda siap melewati verifikasi 3-D Secure.",
      },
      {
        q: "Berapa lama presale fan club dibuka sebelum penjualan umum?",
        a: "Berbeda untuk setiap konser, dan satu-satunya jawaban yang bisa dipercaya adalah pengumuman resminya. Presale biasanya lebih awal sehari atau lebih dari penjualan umum, dan keanggotaan biasanya harus aktif sebelum tanggal batas yang jauh lebih awal lagi. Jangan menduga dari tur sebelumnya.",
      },
      {
        q: "Apakah situs Korea dan situs global memakai antrean yang sama?",
        a: "Belum tentu. Untuk konser yang sama, penjualan berbahasa Korea dan penjualan global bisa ditangani terpisah dalam hal alokasi kursi, verifikasi, dan pengakuan kelayakan fan club. Verifikasi yang selesai di satu sisi tidak menjamin pengakuan di sisi lain, jadi pastikan dari pengumumannya sisi mana yang berlaku untuk Anda.",
      },
    ],
    labels: ID_LABELS,
  },
  {
    locale: "id",
    slug: "nol-world-ticketing-guide",
    sourceChecked: "2026-10-14",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Tiket NOL World: situs yang dulu bernama Interpark Global",
    summary:
      "Ini adalah interpark Global yang dulu. Namanya berubah pada 1 Desember 2025, sebagian besar panduan masih mengarahkan Anda ke nama lamanya, dan berikut alur yang berlaku sekarang.",
    scope:
      "Mencakup platform versi luar negeri untuk konser di Korea. NOL Ticket yang berbahasa Korea adalah produk berbeda, dengan sistem akun berbeda dan verifikasi identitas yang lebih ketat.",
    intro: [
      "Dua perubahan nama terjadi dalam waktu yang berdekatan, dan hampir semua panduan berbahasa Inggris di internet tidak mencerminkan satu pun di antaranya. Yanolja Core menyatukan merek-mereknya di bawah nama NOL pada April 2025, dan saat itulah Interpark Ticket menjadi NOL Ticket. Lalu pada 1 Desember 2025, interpark Global versi luar negeri menjadi NOL World.",
      "Akibatnya dalam praktik: panduan yang menyuruh Anda ke “Interpark Global”, lengkap dengan tangkapan layar antarmuka lamanya, menggambarkan sebuah produk yang sudah berganti nama dan dirancang ulang. Mengikutinya sama dengan memegang peta kedaluwarsa.",
      "Halaman ini melacak peta yang berlaku sekarang. Tanggal di bagian atas halaman adalah hari terakhir kami memeriksanya.",
    ],
    steps: [
      {
        title: "Mulai dari situs versi luar negeri, bukan versi Korea",
        body: "NOL World adalah pintu masuk bagi fan di luar Korea. NOL Ticket yang berbahasa Korea menjalankan verifikasi identitas domestik yang lebih ketat dan umumnya bukan jalur Anda kecuali Anda memegang dokumen domisili Korea. Keduanya adalah akun terpisah, dan mendaftar di satu sisi tidak memberi Anda akses ke sisi lainnya.",
        pitfall:
          "Hasil pencarian dan penanda halaman lama sampai sekarang masih mengarah ke nama merek sebelumnya. Pastikan Anda berada di situs versi luar negeri sebelum menghabiskan waktu membuat akun.",
        takes: "5 menit",
      },
      {
        title: "Daftar dengan data yang ada di paspor",
        body: "Gunakan nama resmi dan tanggal lahir seperti tercetak di paspor Anda. Jika konser yang Anda tuju punya presale fan club, data itu juga harus sama dengan catatan keanggotaan Anda. Perbaiki ketidaksesuaian apa pun sebelum presale dibuka, bukan saat presale sedang berjalan.",
        pitfall:
          "Mengubah nama yang sudah terverifikasi setelahnya adalah proses pengajuan ke layanan pelanggan, bukan sakelar di pengaturan. Isi dengan benar sejak awal.",
        takes: "20 menit",
      },
      {
        title: "Selesaikan verifikasi pelanggan luar negeri sebelum Anda membutuhkannya",
        body: "Verifikasi pelanggan luar negeri adalah proses sekali per akun, dan NOL World menyatakan dengan jelas bahwa data yang sudah diverifikasi tidak dapat dipakai ulang. Selesaikan di akun yang benar-benar akan Anda pakai membeli — jika Anda punya beberapa akun, verifikasi itu tidak berpindah. Menghapus akun memang menghapus data verifikasinya dan membebaskannya untuk akun lain, tetapi akun yang dibatasi karena penyalahgunaan sama sekali tidak bisa dihapus. Verifikasi itu sendiri tidak punya batas usia, meski konser dengan batas usia tetap bisa menolak pesanan. Pemberitahuan penyelesaian dikirim lewat surel, jadi periksa folder spam sebelum menyimpulkan bahwa prosesnya gagal.",
        pitfall:
          "Baru menyadari di tahap pembayaran bahwa verifikasi masih diproses adalah cara klasik kehilangan kursi yang sudah Anda tahan.",
        takes: "1-3 hari termasuk pemrosesan",
      },
      {
        title: "Pastikan syarat konsernya di halaman konser itu sendiri",
        body: "Jumlah kursi yang bisa dibeli per akun, apakah keanggotaan dibutuhkan, syarat identitas di lokasi, dan apakah konser itu terbuka bagi pembeli dari luar negeri — semuanya diatur per konser. Baca halaman konser dan pengumuman resminya; ketika keduanya berbeda, pengumuman resmi untuk konser Anda yang berlaku.",
        pitfall:
          "Sebagian konser membatasi blok kursi atau babak penjualan tertentu hanya untuk pembeli domestik. Ini berlaku per konser dan tidak bisa diketahui dari panduan umum.",
        takes: "10 menit",
      },
      {
        title: "Bawa dokumen yang benar saat mengambil tiket",
        body: "Tiket diambil di loket venue pada hari pertunjukan, dan tidak bisa lebih awal — NOL World menyatakan pengambilan tidak dapat dilakukan sebelum hari pertunjukan. Loket dibuka satu jam sebelum pertunjukan dimulai, dan Anda membutuhkan nomor pemesanan serta kartu identitas. Sisakan waktu karena loket itu sendiri juga akan ada antreannya. Setelah tiket diambil, tiket yang hilang atau dicuri tidak akan diterbitkan ulang.",
        pitfall:
          "Nama di pemesanan, nama di kartu identitas, dan nama di catatan keanggotaan harus sama semuanya. Satu nama panggilan di mana pun pada rantai itu adalah masalah.",
        takes: "—",
      },
    ],
    faq: [
      {
        q: "Apakah NOL World sama dengan Interpark Global?",
        a: "Ini layanan tiket versi luar negeri yang sama setelah berganti merek. interpark Global berganti nama menjadi NOL World pada 1 Desember 2025, menyusul penyatuan merek Yanolja Core di bawah nama NOL pada April 2025, saat Interpark Ticket menjadi NOL Ticket.",
      },
      {
        q: "Kenapa penanda halaman lama saya masih menampilkan Interpark?",
        a: "Pergantian merek butuh waktu untuk menyebar ke hasil pencarian, panduan pihak ketiga, dan halaman tersimpan. Bernavigasilah dari pengumuman resmi konser Anda, bukan dari tautan tersimpan atau tulisan blog.",
      },
      {
        q: "Apakah NOL Global sama saja? Bagaimana dengan NOL Korea?",
        a: "Itu nama-nama yang terlintas ketika orang setengah mengingat pergantian nama tersebut, dan perlu disebut terang-terangan karena itulah yang diketik orang. Ada dua situs: NOL World, yang versi luar negeri, yang bernama interpark Global hingga 1 Desember 2025; dan NOL Ticket, yang berbahasa Korea, yang bernama Interpark Ticket hingga April 2025. Jika Anda diarahkan ke “NOL Global”, “NOL Korea”, atau “NOL KR”, situs yang Anda cari hampir pasti NOL World.",
      },
      {
        q: "Bisakah saya memakai akun NOL Ticket saya di NOL World?",
        a: "Anggap keduanya sebagai akun terpisah dengan verifikasi terpisah. Jangan berasumsi bahwa sesi masuk atau verifikasi yang sudah selesai berlaku di keduanya — pastikan di situs tempat Anda benar-benar akan membeli.",
      },
    ],
    labels: ID_LABELS,
  },
  {
    locale: "id",
    slug: "foreign-card-declined-korean-ticketing",
    sourceChecked: "2026-10-14",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Kenapa kartu Anda ditolak di situs tiket Korea",
    summary:
      "Tiga sistem yang berbeda bisa menolak pembayaran yang sama — platformnya, jaringan kartu Anda, dan bank Anda. Masing-masing punya solusi berbeda, dan hanya satu di antaranya yang cepat.",
    scope:
      "Mencakup pembayaran dengan kartu yang diterbitkan di luar negeri di platform tiket Korea. Ini bukan nasihat keuangan, dan tidak bisa mencakup aturan bank Anda sendiri.",
    intro: [
      "Kartu yang ditolak di tahap pembayaran adalah kegagalan paling mahal dalam pembelian tiket K-pop, karena kursi yang sudah ditahan kembali ke kolam dalam hitungan menit. Hampir semuanya bisa dicegah kalau Anda punya waktu persiapan.",
      "Alasan hal ini terasa acak adalah karena tiga sistem yang saling berdiri sendiri bisa menolak transaksi yang sama, dan pesan kesalahan yang Anda lihat jarang memberi tahu yang mana. Periksalah satu per satu, berdasarkan urutan berapa lama masing-masing butuh waktu untuk diperbaiki.",
    ],
    steps: [
      {
        title: "Periksa apakah verifikasi akun Anda benar-benar sudah selesai",
        body: "Di beberapa platform, kartu yang diterbitkan di luar negeri baru bisa dipakai setelah akunnya diverifikasi sebagai pelanggan luar negeri. Jika verifikasi itu masih diproses, kartu akan gagal sebaik apa pun kondisinya. Ini solusi yang paling lama, dan itulah sebabnya ia ada di urutan pertama.",
        pitfall:
          "Pesan kesalahan pembayaran tidak akan berbunyi “verifikasi Anda masih diproses”. Tampilannya akan terlihat seperti masalah kartu.",
        takes: "1-3 hari",
      },
      {
        title: "Beri tahu bank Anda sebelum penjualan, bukan sesudahnya",
        body: "Aktifkan transaksi internasional dan transaksi daring, dan jika bank Anda mendukungnya, mintalah otorisasi awal untuk rentang nilai dan negaranya. Tagihan pertama yang pernah ada dari merchant Korea pada jam yang tidak biasa persis cocok dengan profil yang diblokir sistem antipenipuan.",
        pitfall:
          "Pemblokiran antipenipuan otomatis sering tidak bersuara di sisi Anda — tidak ada SMS, tidak ada notifikasi aplikasi. Anda baru tahu dari penolakan umum yang muncul di sisi merchant.",
        takes: "1 hari",
      },
      {
        title: "Jangan lakukan tahap pembayaran di dalam peramban bawaan aplikasi",
        body: "Alur 3-D Secure dan kata sandi sekali pakai dari bank sering rusak di dalam peramban yang tertanam di aplikasi media sosial atau pesan. Pakailah peramban ponsel atau komputer yang biasa, dan pastikan Anda bisa menerima pesan verifikasi bank di perangkat yang sama.",
        pitfall:
          "Pengalihan halaman bisa tampak berhasil lalu diam-diam menggugurkan otorisasinya, dan itu terbaca sebagai penolakan.",
        takes: "0 menit, cukup lakukan dengan benar",
      },
      {
        title: "Siapkan cadangan yang benar-benar berbeda, bukan kartu sekandung",
        body: "Kartu kedua dari penerbit yang sama biasanya gagal karena alasan yang sama. Penerbit yang berbeda, jaringan yang berbeda, atau metode alternatif yang didukung platform jika ada, barulah cadangan yang nyata. Dua platform luar negeri itu juga menolak hal yang berlawanan, dan itu layak diketahui sebelum Anda menyalahkan kartunya: NOL World menerima VISA, MasterCard, AMEX, JCB, dan UnionPay tetapi hanya yang diterbitkan di luar Korea, dan menolak kartu terbitan Korea sama sekali. YES24 Global melakukan kebalikannya pada dua di antaranya, mengecualikan American Express yang diterbitkan di luar Korea dan UnionPay sepenuhnya. Kartu yang ditolak di satu platform bisa jadi kartu yang tepat di platform lainnya.",
        pitfall:
          "Dua kartu dari bank yang sama adalah satu kartu bagi sebuah aturan antipenipuan.",
        takes: "30 menit untuk menyiapkan",
      },
      {
        title: "Periksa mata uang dan nominalnya sebelum mengonfirmasi",
        body: "Baca apakah Anda ditagih dalam KRW atau dalam nominal yang sudah dikonversi, dan ketahui biaya transaksi luar negeri kartu Anda. Konversi yang mendorong totalnya melewati batas yang Anda tetapkan sendiri juga bisa menyebabkan penolakan.",
        pitfall:
          "Konversi mata uang dinamis diam-diam menambah biaya. Membayar dalam KRW biasanya pilihan yang lebih murah.",
        takes: "5 menit",
      },
    ],
    faq: [
      {
        q: "Kenapa kartu saya ditolak padahal saldonya cukup?",
        a: "Paling sering salah satu dari tiga hal: akun platform Anda belum menyelesaikan verifikasi pelanggan luar negeri, sistem antipenipuan bank Anda memblokir merchant asing yang tidak dikenal, atau tahap 3-D Secure gagal — umumnya karena dijalankan di dalam peramban bawaan aplikasi. Pesan penolakannya biasanya tidak membedakan ketiganya.",
      },
      {
        q: "Apakah PayPal bisa dipakai?",
        a: "Sebagian platform yang melayani luar negeri mendukung metode pembayaran alternatif pada sebagian konser. Ini diatur per platform dan per acara, bukan secara menyeluruh, jadi periksa pilihan pembayaran yang tercantum di halaman acara Anda sebelum menyusun rencana di atasnya.",
      },
      {
        q: "Sebaiknya saya membayar dalam KRW atau dalam mata uang saya sendiri?",
        a: "Membayar dalam mata uang merchant umumnya lebih murah daripada membiarkan halaman pembayaran mengonversikannya untuk Anda, karena konversi mata uang dinamis menambahkan selisih. Biaya transaksi luar negeri dari kartu Anda sendiri tetap berlaku pada kedua pilihan itu.",
      },
    ],
    labels: ID_LABELS,
  },
  {
    locale: "id",
    slug: "buy-k-pop-albums-from-overseas",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Cara membeli album K-pop dari luar Korea agar terhitung",
    summary:
      "Tempat Anda membeli menentukan apakah pembelian Anda dihitung, berapa yang Anda bayar untuk pengiriman, dan apakah Anda mendapat bonus pra-pesan. Berikut cara memilihnya.",
    scope:
      "Mencakup pembelian album fisik dan barang resmi untuk dikirim ke luar Korea. Tidak mencakup lokapasar penjualan ulang atau barang dagangan tidak resmi.",
    intro: [
      "Berbeda dengan tiket, pertanyaan ini berjalan sepanjang tahun — dan itulah alasan ia ditempatkan di samping tiket. Dan berbeda dengan tiket, pertanyaan ini punya jawaban salah yang tidak terlihat memakan biaya apa pun: album Anda tetap datang, hanya saja ia tidak dihitung.",
      "Tiga hal berbeda tergantung tempat Anda membeli: apakah penjualannya dilaporkan ke tangga album Korea, apakah bonus pra-pesannya ikut datang, dan berapa biaya sampai di tangan setelah pengiriman dan bea masuk dihitung. Ketiganya tidak bergerak bersamaan, jadi pilihan termurah sering kali justru pilihan yang tidak terhitung sama sekali.",
    ],
    steps: [
      {
        title: "Tentukan apa yang sebenarnya Anda inginkan dari pembelian ini",
        body: "Kontribusi tangga lagu, album fisiknya, bonus pra-pesannya, atau harga terendah. Keempatnya menarik ke arah yang berbeda. Tetapkan prioritasnya sebelum Anda memilih tokonya, karena tokonya mengikuti prioritas itu.",
        pitfall:
          "Membeli di lokapasar umum untuk menghemat uang lalu menemukan bahwa itu tidak terhitung adalah versi standar dari kesalahan ini.",
        takes: "5 menit",
      },
      {
        title: "Periksa apakah penjualnya melaporkan ke tangga album Korea",
        body: "Penjualan yang dilaporkan ke tangga album Korea berasal dari pengecer dan toko resmi tertentu. Sebuah barang berupa album resmi tidak berarti penjualannya dilaporkan. Jika kontribusi tangga lagu adalah alasan Anda membeli, pastikan pengecernya termasuk yang melaporkan sebelum Anda memesan.",
        pitfall:
          "Barang album asli di lokapasar pihak ketiga umumnya tidak terhitung. Albumnya nyata; kontribusinya tidak ada di situ.",
        takes: "15 menit",
      },
      {
        title: "Pesan di dalam masa pra-pesan untuk mendapatkan bonusnya",
        body: "Bonus pra-pesan — poster, photocard tambahan, kesempatan ikut acara — terikat pada pemesanan di dalam suatu masa tertentu, dan sering terikat pada pengecer itu saja. Masa itu ditutup sebelum hari rilis, bukan pada hari rilis.",
        pitfall:
          "Bonus eksklusif tiap pengecer tidak bisa ditukar satu sama lain. Memesan album yang sama di tempat lain memberi Anda kumpulan bonus yang berbeda, atau tidak sama sekali.",
        takes: "10 menit",
      },
      {
        title: "Hitung biaya pengiriman dan paparan bea masuknya, bukan harga albumnya",
        body: "Pengiriman dari Korea bisa melebihi harga albumnya, dan apakah Anda masih membayar pungutan impor di atas itu bergantung pada aturan negara Anda sendiri. Periksa aturan itu sekarang, jangan berasumsi: Amerika Serikat menangguhkan batas 800 dolarnya pada Agustus 2025 dan Uni Eropa menghapus batas 150 euronya pada 1 Juli 2026, jadi bagi pembaca di kedua wilayah itu, tidak ada lagi nilai yang cukup kecil untuk masuk tanpa pungutan. Pesanan bersama menurunkan biaya kirim per barang. Hitunglah biaya sampai di tangan sebelum Anda memutuskan.",
        pitfall:
          "Menyusun rencana di atas pembebasan bea yang sudah tidak ada lagi di tempat Anda tinggal. Dan di tempat yang masih punya pembebasan itu, menggabungkan beberapa album ke dalam satu paket bisa mendorong nilai deklarasinya melewati batas dan jadi lebih mahal daripada mengirimnya terpisah — hitung keduanya.",
        takes: "20 menit",
      },
      {
        title: "Simpan catatan pesanan sampai barangnya datang",
        body: "Simpan konfirmasi pesanan, nomor pelacakan, dan nilai deklarasinya. Untuk apa pun yang salah — paket rusak, pertanyaan dari bea cukai, bonus yang tidak ada — inilah yang akan diminta pengecernya dari Anda.",
        pitfall:
          "Layanan pelanggan pengecer Korea sering bekerja dengan nomor pesanan, bukan dengan pencarian lewat surel. Tanpa nomor itu, percakapannya berjalan lambat.",
        takes: "5 menit",
      },
    ],
    faq: [
      {
        q: "Apakah album yang dibeli di luar Korea terhitung untuk tangga album Korea?",
        a: "Penjualan yang dilaporkan oleh pengecer peserta terhitung, dan itu bergantung pada pengecernya, bukan pada lokasi Anda. Membeli album asli dari toko yang tidak melaporkan berarti albumnya nyata tetapi penjualannya tidak dihitung. Periksa pengecernya sebelum memesan jika kontribusi tangga lagu adalah intinya.",
      },
      {
        q: "Apakah pesanan bersama sepadan?",
        a: "Untuk biaya kirim biasanya iya, karena biaya per barang turun tajam. Timbanglah itu dengan aturan impor negara Anda — di tempat yang masih punya pembebasan bea, satu paket bernilai tinggi bisa dikenai pungutan yang tidak akan dikenakan pada beberapa paket kecil terpisah. Di Amerika Serikat dan Uni Eropa perhitungan itu sudah berubah: keduanya menghapus pembebasan untuk nilai rendah, jadi tidak ada lagi batas yang bisa dijadikan tempat berlindung.",
      },
      {
        q: "Kenapa bonus pra-pesan berbeda antar toko?",
        a: "Pengecer menegosiasikan bonus eksklusifnya sendiri, jadi album yang sama membawa tambahan yang berbeda tergantung di mana ia dipra-pesan. Jika sebuah bonus tertentu adalah yang Anda inginkan, Anda harus memesan dari toko yang menawarkannya, di dalam masa yang berlaku di toko itu.",
      },
    ],
    labels: ID_LABELS,
  },
  {
    locale: "id",
    slug: "order-from-weverse-shop-overseas",
    sourceChecked: "2026-10-21",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Memesan dari Weverse Shop di luar Korea",
    summary:
      "Toko mana yang sedang Anda buka, kenapa harganya berubah saat pembayaran, metode pembayaran apa yang benar-benar didapat mata uang Anda, dan negara mana yang tidak bisa dikirimi dari Korea.",
    scope:
      "Mencakup pemesanan di Weverse Shop untuk barang dagangan fisik dan album yang dikirim dari Korea. Pembelian keanggotaan dan tiket ditangani terpisah dan dibahas di panduan presale. Aturan di sini berasal dari pemberitahuan Weverse Shop sendiri dan berubah tanpa banyak peringatan.",
    intro: [
      "Hampir setiap panduan berbahasa Inggris tentang Weverse Shop sampai sekarang masih mengatakan bahwa toko global hanya menerima PayPal atau Eximbay, dan tidak ada yang lain. Itu benar bertahun-tahun lalu. Daftar pembayarannya sekarang lebih panjang, daftar itu ditentukan oleh mata uang yang disetel di akun Anda, bukan oleh negara tempat Anda tinggal, dan sejak Februari 2026 harga di halaman produk bukanlah harga yang Anda bayar.",
      "Tidak ada satu pun dari itu yang disembunyikan — semuanya ada di pemberitahuan milik toko itu sendiri, dan dari sanalah seluruh isi di bawah ini berasal. Hanya saja tidak ada penulis panduan yang pergi membacanya.",
    ],
    steps: [
      {
        title: "Pastikan Weverse Shop mana yang sebenarnya Anda buka",
        body: "Weverse Shop bukan satu toko. Ada toko GLOBAL dan ada toko-toko kawasan, dan masing-masing membawa stok berbeda, menjalankan masa pra-pesan berbeda, serta mengirim dari tempat berbeda. Barang yang Anda lihat dipesan orang lain bisa saja memang tidak ada di toko Anda. Pastikan Anda di toko yang mana sebelum menyusun rencana di sekitar sebuah tanggal rilis, karena batas pra-pesan di satu toko tidak memberi tahu Anda apa pun tentang toko lainnya.",
        pitfall:
          "Tautan yang dibagikan seseorang di komunitas fan membuka toko mereka, bukan toko Anda. Jika halamannya terbuka tetapi barangnya tidak mau masuk keranjang, biasanya Anda berada di toko yang salah, bukan terlambat.",
        takes: "2 menit",
      },
      {
        title: "Setel mata uang Anda sebelum melihat apa pun",
        body: "Mata uang bawaan Anda menentukan metode pembayaran apa yang ditawarkan kepada Anda. Weverse menyatakannya per mata uang: USD mendapat PayPal, Eximbay, Alipay+, Apple Pay, WeChat Pay, dan Grab Pay. JPY mendapat daftar yang sama tanpa Grab Pay. CNY kehilangan PayPal. MXN hanya PayPal dan Apple Pay. KRW menambahkan kartu Korea dan dompet digital Korea — Toss, NAVER Pay, Kakao Pay, PAYCO. MXN adalah daftar terpendek dari keempat mata uang non-Korea dan yang paling layak direncanakan: dua metode, keduanya digital, tanpa opsi tunai. Jika tidak satu pun sudah disiapkan, tidak ada tombol ketiga di halaman pembayaran.",
        pitfall:
          "Tidak ada pilihan “bayar dengan Visa” yang sederhana pada mata uang selain KRW. Kartu Anda berjalan melalui PayPal atau Eximbay, dan bagi bank Anda itu transaksi berjenis lain daripada tagihan merchant Korea — dan itulah alasan kartu yang berfungsi di tempat lain masih bisa gagal di sini.",
        takes: "3 menit",
      },
      {
        title: "Perkirakan harganya naik saat pembayaran, dan pahami sebabnya",
        body: "Sejak 3 Februari 2026, Weverse menghitung pajak dari alamat pengiriman dan alamat penagihan Anda. Pesanan yang menuju Korea menampilkan harga termasuk pajak sepanjang prosesnya. Pesanan yang menuju tempat lain menampilkan harga halaman produk tanpa pajak, dan pajak negara tujuan ditambahkan saat pembayaran begitu Anda memasukkan alamat. Angka di halaman produk bukan angka yang Anda bayar, dan itu disengaja, bukan kesalahan.",
        pitfall:
          "Ini terlihat persis seperti penipuan atau gangguan sistem, dan di titik inilah orang meninggalkan pesanannya. Kenaikan itu adalah pajak yang negara Anda sendiri kenakan, dipungut di depan alih-alih oleh bea cukai nanti.",
        takes: "1 menit",
      },
      {
        title: "Isi alamat penagihan, bukan hanya alamat pengiriman",
        body: "Perubahan Februari 2026 yang sama menambahkan kolom alamat penagihan saat pembayaran, karena perhitungan pajaknya membutuhkannya. Untuk sebagian produk tak berwujud — barang dan konten digital — alamat penagihan bisa jadi wajib, bukan opsional. Isilah dengan akurat: dari situlah tarif pajaknya dihitung, dan alamat yang salah bukan sesuatu yang bisa Anda perbaiki diam-diam nanti.",
        pitfall:
          "Menyalin alamat pengiriman ke kolom penagihan tanpa berpikir aman ketika keduanya sama dan salah ketika keduanya berbeda. Jika kartu Anda terdaftar pada alamat lain, pakailah alamat itu.",
        takes: "2 menit",
      },
      {
        title: "Periksa bahasa alamat Anda terhadap negara tujuan",
        body: "Weverse meminta pelanggan internasional memastikan bahasa apa yang dibutuhkan negara tujuan untuk alamatnya sebelum memasukkannya. Aturannya lebih jelas pada arah sebaliknya: pesanan yang dikirim ke Korea Selatan harus membawa alamat dalam bahasa Korea, karena kurir bisa menolak atau salah memproses alamat berbahasa Inggris. Untuk tempat lainnya, tulislah alamat sesuai yang diharapkan layanan pos negara Anda sendiri.",
        pitfall:
          "Mengalihhurufkan alamat Korea ke bahasa Inggris adalah penyebab tunggal paling umum pengiriman tertunda atau gagal pada pesanan yang menuju Korea.",
        takes: "5 menit",
      },
      {
        title: "Pastikan Korea bisa mengirim ke tempat Anda sama sekali",
        body: "Pengiriman dari Korea Selatan tidak tersedia untuk sejumlah negara dan kawasan yang daftarnya dipelihara dan diperbarui Weverse. Pada revisi 15 Juli 2026, daftar itu mencakup Myanmar, Republik Demokratik Kongo, Irak, Iran, Lebanon, Mali, Rusia, Andorra, Ukraina, Belarus, Afghanistan, Antilles Belanda, Israel, dan Turki. Daftarnya bergerak, jadi periksalah pemberitahuannya, bukan halaman ini.",
        pitfall:
          "Daftar itu digambarkan sebagai gangguan sementara, bukan kebijakan, yang berarti sebuah negara bisa keluar dari daftar sebagaimana ia bisa masuk. Pesanan Anda yang berhasil sebelumnya maupun pesanan teman Anda tahun lalu tidak memutuskan apakah Anda bisa memesan hari ini.",
        takes: "2 menit",
      },
      {
        title: "Pesan di dalam masa pra-pesan jika bonusnya penting bagi Anda",
        body: "Bonus pra-pesan — poster, photocard, dan bonus cetakan pertama yang biasanya justru menjadi alasan memesan dari toko resmi alih-alih dari tempat yang lebih murah — terikat pada masa pra-pesan, bukan pada albumnya. Begitu masa itu ditutup, album yang sama dikirim tanpa bonus-bonus itu. Jika bonusnya adalah intinya, yang harus dijadikan pusat rencana adalah tenggatnya, bukan tanggal rilisnya.",
        pitfall:
          "Masa pra-pesan ditutup pada suatu jam di Korea, yang berarti malam sebelumnya atau dini hari di tempat sebagian besar pembaca situs ini tinggal.",
        takes: "Sebelum tenggat",
      },
    ],
    faq: [
      {
        q: "Bisakah saya membayar dengan Visa atau Mastercard di Weverse Shop?",
        a: "Tidak sebagai pilihan kartu langsung di luar setelan mata uang Korea. Pada USD, JPY, CNY, dan MXN, kartunya berjalan melalui PayPal atau Eximbay. Itu tetap menagih kartu Anda, tetapi bank Anda melihat jenis transaksi yang berbeda, jadi mengaktifkan pembayaran internasional lebih dulu layak dilakukan.",
      },
      {
        q: "Kenapa harganya naik ketika saya memasukkan alamat saya?",
        a: "Sejak 3 Februari 2026, harga di luar Korea ditampilkan di halaman produk tanpa pajak, dan pajak untuk negara tujuan Anda ditambahkan saat pembayaran. Itu adalah pajak yang negara Anda sendiri kenakan, dipungut saat pembelian alih-alih saat pengiriman.",
      },
      {
        q: "Apakah saya akan dikenai bea cukai ketika barangnya datang?",
        a: "Weverse sekarang membayar bea dan pajak di muka saat pembayaran untuk pesanan yang memenuhi syarat, dan menyatakan hal itu mengurangi kebutuhan pembayaran tambahan selama proses kepabeanan. Weverse juga menyatakan ini tidak berlaku untuk setiap negara atau kawasan, jadi ini harapan yang wajar, bukan jaminan.",
      },
      {
        q: "Saya di Meksiko. Metode pembayaran mana yang sebenarnya saya dapatkan?",
        a: "Dua. Pemberitahuan pembayaran Weverse mencantumkan MXN sebagai PayPal dan Apple Pay — daftar terpendek dari keempat mata uang non-Korea, dan keduanya digital. Tidak ada opsi tunai dan tidak ada tombol ketiga, jadi siapkan salah satu dari keduanya sebelum sebuah jendela prapesan dan bukan di dalamnya.",
      },
      {
        q: "Apakah Weverse Shop mengirim ke negara saya?",
        a: "Biasanya iya, tetapi ada daftar terpelihara berisi negara dan kawasan yang saat ini tidak bisa menerima pengiriman dari Korea Selatan. Periksa pemberitahuan itu untuk daftar yang berlaku sebelum memesan — daftarnya direvisi seiring perubahan keadaan.",
      },
    ],
    labels: ID_LABELS,
  },
  {
    locale: "id",
    slug: "nol-world-verified-member-ekyc",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "NOL World Verified Member: lolos pemeriksaan eKYC dari luar Korea",
    summary:
      "Sebagian konser tidak mengizinkan Anda memesan sama sekali sampai paspor Anda terverifikasi. Pemeriksaannya berupa pengambilan gambar paspor dan wajah secara langsung, tidak bisa diulang sembarangan, dan satu arahan yang NOL World berikan soal waktu justru arahan yang paling sering diabaikan orang.",
    scope:
      "Mencakup pemeriksaan identitas Verified Member Only di NOL World, sebagaimana NOL World mendokumentasikannya: kapan ia berlaku, apa yang dibutuhkan pengambilan gambarnya, apa yang terjadi pada nama yang disimpannya, dan apa yang mengatur ulang atau membatasinya. Pemegang paspor Korea diarahkan ke NOL Ticket, yang merupakan pemeriksaan berbeda di situs berbeda. Tidak ada apa pun di sini yang merupakan cara mengakali sebuah verifikasi.",
    intro: [
      "Konser Verified Member Only adalah konser yang sama sekali tidak bisa Anda pesan sampai identitas Anda terverifikasi. Bukan peringatan saat pembayaran — pemesanannya memang tidak tersedia bagi akun yang belum terverifikasi. Fan mengetahui hal ini tepat pada saat pemesanan dibuka, dan itu saat terburuk yang mungkin, karena verifikasinya adalah pengambilan gambar langsung atas paspor dan wajah Anda dan ia butuh waktu sebanyak yang ia butuhkan.",
      "NOL World menjelaskan layanan ini sebagai cara membatasi akses untuk tujuan tidak sah seperti penjualan ulang tiket. Itu layak diterima apa adanya: pemeriksaan ini ada untuk mengikat satu orang pada satu akun, dan hampir setiap aturan di bawah ini mengalir dari situ.",
    ],
    steps: [
      {
        title: "Periksa apakah konser Anda membutuhkannya, dan apakah Anda di situs yang benar",
        body: "Verified Member Only disetel per produk, bukan per akun — NOL World menyatakan bahwa hanya anggota yang telah menyelesaikan verifikasi identitas di halaman produk yang bisa melakukan pemesanan. Jadi pertanyaan pertama adalah apakah konser Anda membawa tanda itu sama sekali. Pertanyaan kedua adalah apakah Anda semestinya berada di NOL World: NOL World memberi tahu pemegang paspor Korea untuk memakai situs NOL Ticket, yang menjalankan pemeriksaan yang sepenuhnya berbeda.",
        pitfall:
          "Menganggap pemeriksaan identitas sebagai tugas sekali jalan yang akan diingatkan oleh situsnya. Untuk konser Verified Member Only tidak ada pengingat — pemesanannya memang tidak ada di sana.",
        takes: "10 menit",
      },
      {
        title: "Lakukan satu sampai dua hari sebelum pemesanan dibuka",
        body: "Ini arahan NOL World sendiri dan fakta paling berguna di halaman ini: selesaikan verifikasinya setidaknya satu sampai dua hari di muka, karena mencobanya dekat dengan waktu pembukaan tiket berarti lalu lintas yang tinggi bisa menimbulkan kesulitan. Begitu selesai, Anda bisa memesan konser Verified Member Only mana pun tanpa memverifikasi lagi. Biaya melakukannya lebih awal adalah satu malam. Biaya melakukannya terlambat adalah konsernya.",
        pitfall:
          "Memulai pengambilan gambar pada sepuluh menit sebelum presale. Verifikasi yang gagal karena lalu lintas tidak bisa dipercepat, dan antrean tidak menunggu.",
        takes: "30 menit, dua hari lebih awal",
      },
      {
        title: "Verifikasilah akun yang benar-benar akan Anda pakai membeli",
        body: "Verifikasi berlaku sekali per akun, dan NOL World menyatakan bahwa data yang telah diverifikasi tidak dapat dipakai ulang — satu paspor memverifikasi satu akun. Jika Anda punya lebih dari satu akun, inilah saat memutuskan mana yang nyata, karena verifikasinya tidak berpindah sesudahnya. NOL World menambahkan bahwa menghapus akun akan menghapus data verifikasinya dan membebaskannya untuk akun lain, tetapi akun yang dibatasi karena penyalahgunaan sama sekali tidak bisa dihapus.",
        pitfall:
          "Memverifikasi di akun yang kebetulan sedang Anda masuki, lalu membeli di akun yang lain. Akun kedua itu belum terverifikasi, dan konsernya Verified Member Only.",
        takes: "5 menit untuk memutuskan",
      },
      {
        title: "Siapkan paspor asli, yang masih berlaku dan belum kedaluwarsa",
        body: "Hanya paspor yang masih berlaku yang diterima, dan NOL World tegas bahwa foto atau salinan tidak diterima: bukan hasil pindai yang dicetak, bukan tangkapan layar, bukan foto halaman paspor di layar lain. Jika paspor Anda sudah kedaluwarsa, Anda harus memperbaruinya sebelum bisa memverifikasi — tidak ada jalur dokumen alternatif di NOL World bagi pemegang paspor non-Korea.",
        pitfall:
          "Mengambil foto paspor yang sudah ada di galeri ponsel Anda karena paspor aslinya tertinggal di lemari besi hotel. Upaya itu tercatat sebagai upaya memakai salinan.",
        takes: "—",
      },
      {
        title: "Lolos pengambilan gambar pada percobaan pertama",
        body: "NOL World menerbitkan apa saja yang membuat pengambilan gambar gagal, dan daftarnya terbaca seperti daftar hal-hal yang orang lakukan ketika terburu-buru. Sejajarkan paspor dan wajah Anda dengan panduan di layar. Jauhkan kilau dan pantulan dari halaman paspor maupun wajah Anda. Wajah Anda harus cocok dengan foto di paspor. Tahan perangkatnya tetap stabil setidaknya lima detik selama pengambilan gambar. Dan jika perangkatnya berspesifikasi rendah atau jaringannya tidak stabil, datanya bisa tidak tersimpan dengan benar meski pengambilan gambarnya terlihat baik-baik saja. Ketika gagal, layarnya menyebutkan alasannya — bacalah, jangan mencoba ulang dengan buta.",
        pitfall:
          "Melakukan ini dengan satu tangan, pada malam hari, di bawah lampu plafon yang memantul di laminasi paspor. Cahaya dari atas pada halaman paspor adalah alasan paling umum sebuah pengambilan gambar tidak terbaca.",
        takes: "15 menit",
      },
      {
        title: "Periksa nama yang sebenarnya tersimpan",
        body: "Hanya nama dalam huruf Latin yang diterima. NOL World menyatakan bahwa jika nama paspor Anda tidak dalam bahasa Inggris atau mengandung karakter khusus, pemesanannya tidak dapat dilanjutkan, dan Anda bisa dialihkan ke pengajuan koreksi nama — sebuah pengajuan, bukan perubahan di setelan. Nama yang tersimpan terlihat di My Page, dan di situlah tempat memeriksanya alih-alih berasumsi. Ini penting sekarang karena setelah verifikasi Anda sama sekali tidak bisa mengubah nama, tanggal lahir, atau alamat surel: pemesanan hanya bisa dilakukan dengan data yang terverifikasi.",
        pitfall:
          "Tidak memeriksa namanya karena verifikasinya menyatakan berhasil. Berhasil dan menyimpan karakter yang benar adalah dua hal berbeda, dan salah satunya sudah tidak bisa disunting lagi.",
        takes: "5 menit",
      },
      {
        title: "Pahami urutan namanya — dan apa yang sebenarnya penting di pintu masuk",
        body: "NOL World mengubah urutan nama yang disimpan pada 16 April 2025. Anggota yang terverifikasi sebelum tanggal itu menyimpan Nama Depan + (Nama Tengah) + Nama Belakang; anggota yang terverifikasi setelahnya menyimpan Nama Belakang + Nama Depan + (Nama Tengah). NOL World menyatakan dengan terang bahwa meski urutannya berbeda dari paspor Anda, verifikasi tiket dan masuk ke venue tetap dimungkinkan — verifikasi di lokasi hanya dibatasi jika namanya sendiri berbeda dari nama di paspor. Anggota yang terverifikasi sebelum 16 April 2025 akan mendapat format baru itu ketika mereka memverifikasi ulang setelah paspornya kedaluwarsa.",
        pitfall:
          "Mengajukan koreksi nama karena urutannya terlihat salah. NOL World menyatakan urutannya bukan masalahnya; nama yang berbeda itulah masalahnya. Yang harus benar adalah karakternya, bukan urutannya.",
        takes: "5 menit",
      },
      {
        title: "Pahami apa yang bisa membatalkan verifikasi yang sudah Anda lalui",
        body: "Verifikasi yang sudah selesai bisa dibatalkan sesudahnya. NOL World menyebut dua penyebabnya: mencoba verifikasi dengan identitas palsu atau yang diubah — yang ia definisikan mencakup salinan cetak dan tangkapan layar — serta paspor yang dipakai untuk verifikasi menjadi kedaluwarsa. Jika verifikasi Anda dibatalkan, verifikasilah ulang memakai akun yang sudah ada. NOL World secara khusus memperingatkan bahwa mencoba akun baru justru bisa menimbulkan kegagalan sistem berulang, dan bahwa verifikasi yang ternyata diperoleh dengan cara tidak sah bisa membuat Anda kehilangan akses ke layanan pemesanan.",
        pitfall:
          "Membuka akun baru untuk kabur dari pengaturan ulang itu. Pengaturan ulang itu mengikuti dokumennya, bukan akunnya, dan akun baru mewarisi masalahnya sekaligus kecurigaannya.",
        takes: "—",
      },
      {
        title: "Pahami apa yang platform anggap penipuan, dan berapa harganya",
        body: "Alasan pemeriksaan ini seketat ini ada di kebijakan antipenipuan NOL World, dan konsekuensinya diterbitkan. Memakai identitas curian atau palsu untuk verifikasi terdaftar sebagai penggunaan tidak sah. Demikian pula memesan banyak tiket di luar penggunaan normal dengan data pribadi yang identik atau serupa — data kontak, alamat pengiriman, atau informasi pembayaran yang sama di beberapa akun. Sanksinya berkisar dari pembatasan pemesanan selama tiga bulan atau lebih sampai penangguhan akun permanen dan pembatalan setiap tiket yang dipesan. Penyelenggara acara bisa menambahkan sanksinya sendiri, termasuk pengeluaran dari fan club. Ada jalur banding, dan di kasus perdagangan tidak sah yang terkonfirmasi jelas, tidak ada.",
        pitfall:
          "Memverifikasi beberapa akun anggota keluarga dari satu ponsel, satu alamat, dan satu kartu untuk menaikkan peluang Anda di presale. Pola itu ada di daftar yang diterbitkan, dan sanksi yang disebutkan menjangkau setiap tiket di setiap akun tersebut.",
        takes: "10 menit untuk membaca",
      },
    ],
    faq: [
      {
        q: "Apa arti Verified Member Only sebenarnya di halaman sebuah acara?",
        a: "Bahwa konser itu tertutup bagi akun yang belum terverifikasi. NOL World menggambarkannya sebagai layanan yang memungkinkan anggota memverifikasi identitasnya sebelum membeli, di mana hanya anggota yang telah menyelesaikan verifikasi di halaman produk yang bisa melakukan pemesanan. NOL World menyatakan tujuannya adalah membatasi akses untuk tujuan tidak sah seperti penjualan ulang tiket. Siapkan paspor dan ponsel cerdas Anda, karena pemeriksaannya membutuhkan keduanya.",
      },
      {
        q: "Saya pemegang paspor Korea. Bisakah saya langsung memverifikasi di NOL World?",
        a: "NOL World memberi tahu pemegang paspor Korea untuk memakai situs NOL ticket. Itu situs berbeda dengan pemeriksaan identitas berbeda — umumnya autentikasi ponsel Korea atau I-PIN — dan akun terpisah.",
      },
      {
        q: "Saya warga negara Korea yang tinggal di luar negeri tanpa nomor ponsel Korea. Lalu bagaimana?",
        a: "NOL World menerbitkan sebuah jalur dokumen. NOL World mengarahkan warga Korea Selatan yang berdomisili di luar negeri ke NOL Ticket, tempat identitas bisa diverifikasi lewat autentikasi ponsel atau I-PIN; ketika tidak ada nomor registrasi penduduk Korea dan autentikasi ponsel tidak tersedia, NOL Ticket menerima dokumen pendukung yang membuktikan status warga Korea di luar negeri — Sertifikat Registrasi Warga Korea di Luar Negeri bersama paspor Korea Selatan, diajukan melalui formulir pertanyaan layanan pelanggannya beserta ID akun Anda. NOL World menyatakan sertifikat itu bisa diperoleh secara daring melalui Badan Warga Korea di Luar Negeri, dan bahwa Kartu Registrasi Orang Asing bisa diterima sebagai pengganti ketika sertifikatnya sulit didapat. NOL World juga memperingatkan bahwa dokumen palsu berarti pembatasan segera.",
      },
      {
        q: "Apakah ada batas usia minimum untuk verifikasi identitas?",
        a: "NOL World menyatakan tidak ada batas usia pada verifikasinya sendiri, tetapi Anda masih bisa tidak dapat memesan atau menghadiri produk yang membawa batasan usia. Terverifikasi tidak sama dengan memenuhi syarat untuk sebuah konser tertentu.",
      },
      {
        q: "Nama saya di My Page urutannya berbeda dari paspor saya. Apakah saya akan ditolak?",
        a: "NOL World menyatakan tidak. NOL World mengubah urutan yang disimpan pada 16 April 2025 dan menyatakan bahwa verifikasi tiket dan masuk tetap dimungkinkan meski urutannya berbeda dari paspor. Verifikasi di lokasi hanya dibatasi jika namanya sendiri berbeda — jadi periksalah ejaan dan karakternya, bukan urutannya.",
      },
      {
        q: "Paspor saya kedaluwarsa setelah saya memverifikasi. Apakah saya harus melakukan sesuatu?",
        a: "Ya. NOL World mencantumkan kedaluwarsanya paspor sebagai penyebab dibatalkannya verifikasi yang sudah selesai, jadi memperbarui paspor berarti memverifikasi ulang — di akun yang sudah ada, bukan akun baru. Jika Anda terverifikasi sebelum 16 April 2025, inilah juga saat urutan nama yang baru diterapkan pada catatan Anda.",
      },
      {
        q: "Bisakah saya memverifikasi dengan paspor anggota keluarga kalau paspor saya kedaluwarsa?",
        a: "Tidak, dan ini satu-satunya pertanyaan yang punya konsekuensi tertulis alih-alih sekadar pendapat. NOL World mencantumkan pemakaian identitas curian atau palsu untuk verifikasi di antara tindakan yang ia perlakukan sebagai penggunaan tidak sah, dan sanksi yang disebutkan sampai pada penangguhan akun permanen dan pembatalan setiap tiket yang dipesan. NOL World juga menyatakan verifikasi identitas bisa dilakukan di venue dan meminta Anda memesan dengan nama dan akun Anda sendiri serta membawa identitas berfoto yang masih berlaku. Tiket yang tidak bisa bertahan di pintu masuk bukanlah tiket.",
      },
      {
        q: "Akun saya dibatasi. Apakah ada jalur banding?",
        a: "NOL World menerbitkan satu. NOL World menyatakan pengguna umumnya diberi waktu setidaknya satu hari untuk memberikan penjelasan, dan bahwa banding semestinya berupa pernyataan terperinci yang mencakup ID akun Anda yang dibatasi, nama lengkap, dan informasi kontak, tanpa format atau templat yang diwajibkan, dikirim melalui formulir pertanyaan layanan pelanggannya. Peninjauannya butuh kira-kira 10 sampai 15 hari dan hasilnya datang lewat surel. NOL World juga menyatakan batasnya: melewatkan tenggatnya atau gagal menghilangkan kecurigaan berarti pemesanan dibatalkan secara paksa, dan di kasus perdagangan tidak sah yang terkonfirmasi jelas, tiket bisa dibatalkan tanpa banding sama sekali.",
      },
    ],
    labels: ID_LABELS,
  },
  {
    locale: "zh-Hant",
    slug: "fan-club-presale-checklist",
    sourceChecked: "2026-10-14",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "後援會先行販售：在截止之前取得資格",
    summary:
      "光有會員資格並不等於有購買權。兩者之間還有一道驗證手續，它有自己的截止時間，而錯過它是粉絲失去先行販售最常見的方式。",
    scope:
      "涵蓋韓國演出的後援會先行販售資格的一般樣貌。每一次巡迴都會在官方公告中設定自己的等級、截止時間與條件，而公告的效力高於任何一般性說明。",
    intro: [
      "先行販售的購買權是一條有三個環節的鏈，而粉絲通常只知道第一個。你買會員資格。然後你要把那份會員資格與售票帳號連結並完成驗證。只有到那時，你才取得先行販售的資格。",
      "每一個環節都有自己的截止時間，而驗證的截止時間常常比人們預期的更早——某些情況下比先行販售本身早好幾天。前一晚才買的會員資格，即使是有效的，也可能已經太晚。",
      "請把公告當成規格書，把本頁當成檢查清單。",
    ],
    steps: [
      {
        title: "讀資格條款，不要讀標題",
        body: "公告會指明哪一種會員商品與哪一個等級符合資格，以及它必須在哪一個日期之前完成購買或處於有效狀態。這是兩個不同的日期，而且兩個都重要。請把它們連同 KST 一起寫下你自己時區的時間。",
        pitfall:
          "在某些巡迴中，雖然有效但購買時間在截止之後的會員資格並不符合資格。「我有會員資格」和「我取得了資格」不是同一件事。",
        takes: "10 分鐘",
      },
      {
        title: "在截止之前好好提早買會員資格",
        body: "請從該藝人的官方商店購買。保留訂單確認與會員編號。如果會員資格是附數位序號的實體組合包，請把序號的寄送與啟用時間算進去，那不是即時的。自 2026 年 9 月 3 日起，Weverse Shop 也在支援的會員資格上提供自動付款：續訂會在有效期間的最後一天向已登錄的付款方式扣款，所以會員資格不會在巡迴公布的那一週悄悄失效。它是按會員類別分別設定的——Global、Japan 與 USA 是分開管理的。",
        pitfall:
          "轉售或被贈送的會員序號經常無法通過驗證，因為登錄的姓名與你的售票帳號不符。自動付款消除了失效風險，但不消除姓名風險：它只會續訂它所綁定的那個帳號。",
        takes: "30 分鐘",
      },
      {
        title: "在售票平台上連結並驗證會員資格",
        body: "這就是人們會漏掉的一步。在售票平台上有一個獨立的動作用來驗證你的後援會身分，它在一段期間內開放——通常是先行販售前幾天——並在先行販售之前關閉。請在它開放的那一小時就去做。",
        pitfall:
          "同一場演出，韓文販售與全球販售的驗證可能是分開處理的。完成其中一邊，不一定就取得另一邊。",
        takes: "20 分鐘，在開放期間內",
      },
      {
        title: "讓三個姓名完全一致",
        body: "護照、後援會會員資格、售票帳號。三個都要。相同的法定姓名、相同的出生日期、相同的順序。如果其中一個是錯的，請在驗證期間開始之前更正，而不是之後。",
        pitfall:
          "這是先行販售資格無法生效最常被記錄的原因，而且在它真正重要的那一刻之前完全看不出來。",
        takes: "15 分鐘",
      },
      {
        title: "確認資格真的到手了",
        body: "完成驗證之後，請找一個明確的確認——一個標記、一行狀態、一封電子郵件。如果你找不到「你符合資格」的正面確認，就當作你沒有，並在期間還開著的時候聯絡客服。",
        pitfall:
          "沒有消息不代表成功。送出表單不等於被授予資格。",
        takes: "10 分鐘",
      },
    ],
    faq: [
      {
        q: "買了會員資格就保證有先行販售購買權嗎？",
        a: "不。在多數巡迴中，還有一道獨立的驗證手續，把會員資格連結到你的售票帳號，而它有自己的開放與關閉期間，都在先行販售之前。會員資格是前提條件，不是資格本身。",
      },
      {
        q: "我可以用別人的會員資格嗎？",
        a: "實務上不行，因為驗證會把登錄的姓名與出生日期比對你的售票帳號與你的身分證件。除了行不通之外，它還讓訂單面臨被取消的風險。",
      },
      {
        q: "先行販售比一般販售早多久開放？",
        a: "依巡迴而異。早一天以上很常見，而會員資格的截止時間又更早。你那一場的官方公告是唯一可靠的來源。",
      },
    ],
    labels: ZH_LABELS,
  },
  {
    locale: "id",
    slug: "fan-club-presale-checklist",
    sourceChecked: "2026-10-14",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Presale fan club: cara memenuhi syarat sebelum tutup",
    summary:
      "Keanggotaan saja bukan akses. Ada satu langkah verifikasi di antara keduanya, langkah itu punya tenggatnya sendiri, dan melewatkannya adalah cara paling umum fan kehilangan presale.",
    scope:
      "Mencakup bentuk umum kualifikasi presale fan club untuk konser di Korea. Setiap tur menetapkan tingkat, batas waktu, dan syaratnya sendiri di pengumuman resmi, dan pengumuman itu mengalahkan keterangan umum apa pun.",
    intro: [
      "Akses presale adalah rantai dengan tiga mata, dan fan biasanya hanya tahu mata yang pertama. Anda membeli keanggotaannya. Lalu Anda menghubungkan dan memverifikasi keanggotaan itu terhadap akun tiket Anda. Baru setelah itu Anda mendapat hak presale.",
      "Setiap mata rantai punya tenggatnya sendiri, dan tenggat verifikasi rutin jatuh lebih awal daripada perkiraan orang — dalam beberapa kasus beberapa hari sebelum presale itu sendiri. Keanggotaan yang dibeli malam sebelumnya bisa sudah terlambat meski statusnya aktif.",
      "Perlakukan pengumumannya sebagai spesifikasi, dan halaman ini sebagai daftar periksa.",
    ],
    steps: [
      {
        title: "Baca klausul kelayakannya, bukan judulnya",
        body: "Pengumuman akan menyebutkan produk dan tingkat keanggotaan mana yang memenuhi syarat, serta tanggal kapan keanggotaan itu harus sudah dibeli atau sudah aktif. Itu dua tanggal yang berbeda dan keduanya penting. Catat keduanya dalam zona waktu Anda sendiri berdampingan dengan KST.",
        pitfall:
          "Pada sebagian tur, keanggotaan yang aktif tetapi dibeli setelah batas waktu tidak memenuhi syarat. “Saya punya keanggotaannya” tidak sama dengan “Saya memenuhi syarat”.",
        takes: "10 menit",
      },
      {
        title: "Beli keanggotaannya jauh sebelum batas waktunya",
        body: "Belilah dari toko resmi artis tersebut. Simpan konfirmasi pesanan dan nomor keanggotaannya. Jika keanggotaan itu berupa paket fisik dengan kode digital, perhitungkan waktu pengiriman dan aktivasi kodenya, yang tidak instan. Sejak 3 September 2026 Weverse Shop juga menyediakan Auto Payment pada keanggotaan yang mendukungnya: perpanjangannya ditagih ke metode terdaftar pada hari terakhir masa berlaku, sehingga keanggotaan tidak bisa berakhir tanpa disadari di pekan sebuah tur diumumkan. Ini disetel per kategori keanggotaan — Global, Japan, dan USA dikelola terpisah.",
        pitfall:
          "Kode keanggotaan hasil jual beli atau hadiah sering gagal verifikasi, karena nama terdaftarnya tidak akan cocok dengan akun tiket Anda. Auto Payment menghilangkan risiko kedaluwarsa tetapi bukan risiko nama: ia memperpanjang akun mana pun yang ia tempeli.",
        takes: "30 menit",
      },
      {
        title: "Hubungkan dan verifikasi keanggotaan di platform tiket",
        body: "Inilah langkah yang orang lewatkan. Di platform tiket ada tindakan tersendiri untuk memverifikasi status fan club Anda, dan tindakan itu terbuka dalam satu jendela waktu — umumnya beberapa hari sebelum presale — dan tertutup sebelum presale. Lakukan pada jam ia dibuka.",
        pitfall:
          "Verifikasi pada penjualan berbahasa Korea dan pada penjualan global bisa ditangani terpisah untuk konser yang sama. Menyelesaikan yang satu tidak otomatis memberi Anda yang lain.",
        takes: "20 menit, di dalam jendela waktunya",
      },
      {
        title: "Buat ketiga nama itu sama persis",
        body: "Paspor, keanggotaan fan club, dan akun tiket. Ketiganya. Nama resmi yang sama, tanggal lahir yang sama, urutan yang sama. Jika salah satu keliru, perbaiki sebelum jendela verifikasi, bukan sesudahnya.",
        pitfall:
          "Ini penyebab paling sering terdokumentasi atas gagalnya hak presale diterapkan, dan ia tidak terlihat sampai persis saat ia menentukan.",
        takes: "15 menit",
      },
      {
        title: "Pastikan haknya benar-benar masuk",
        body: "Setelah memverifikasi, cari konfirmasi yang tegas — sebuah lencana, satu baris status, sebuah surel. Jika Anda tidak bisa menemukan konfirmasi positif bahwa Anda memenuhi syarat, anggap Anda tidak, dan hubungi layanan pelanggan selagi jendelanya masih terbuka.",
        pitfall:
          "Sunyi bukan berarti berhasil. Formulir yang terkirim bukan hak yang sudah diberikan.",
        takes: "10 menit",
      },
    ],
    faq: [
      {
        q: "Apakah membeli keanggotaan menjamin akses presale?",
        a: "Tidak. Pada sebagian besar tur ada langkah verifikasi tersendiri yang menghubungkan keanggotaan ke akun tiket Anda, dengan jendela waktunya sendiri yang terbuka dan tertutup sebelum presale. Keanggotaan adalah prasyarat, bukan haknya itu sendiri.",
      },
      {
        q: "Bisakah saya memakai keanggotaan orang lain?",
        a: "Dalam praktiknya tidak, karena verifikasi mencocokkan nama dan tanggal lahir terdaftar terhadap akun tiket Anda dan dokumen identitas Anda. Selain tidak berfungsi, itu membuat pesanan Anda berisiko dibatalkan.",
      },
      {
        q: "Berapa lama presale dibuka lebih awal dibanding penjualan umum?",
        a: "Berbeda-beda per tur. Sehari atau lebih lebih awal itu umum, dan batas waktu keanggotaan jatuh lebih awal lagi. Pengumuman resmi untuk konser Anda adalah satu-satunya sumber yang bisa dipercaya.",
      },
    ],
    labels: ID_LABELS,
  },
  {
    locale: "zh-Hant",
    slug: "nol-world-queue-and-seat-selection",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "NOL World 的排隊，以及什麼會讓你的順位歸零",
    summary:
      "重新整理會清掉你的順位。第二台裝置會關掉你的第一個號碼。座位會自己更新，不需要重新載入。這些全都寫在 NOL World 自己的 FAQ 裡，而且每一條都與人們的本能相反。",
    scope:
      "涵蓋 NOL World 的排隊、座位圖與候補在開賣期間的行為。註冊與海外顧客驗證都發生在這一切之前，收錄在 NOL World 指南中。本頁所有內容都出自 NOL World 公開的 FAQ。",
    intro: [
      "在購票排隊時，人的本能是重新整理，以及在第一個視窗卡住時再開一個瀏覽器。在 NOL World 上，這兩件事都會讓你失去你正想保護的東西，而平台在自己的說明頁面裡就是這麼寫的。",
      "這是開賣過程中沒有任何指南談到的部分，因為它無法從外面推敲出來——你只會在慌亂之中、在九十秒內看到它一次。",
    ],
    steps: [
      {
        title: "不要重新整理。重新整理會讓你的順位歸零",
        body: "NOL World 說得很直白：你無法跳過排隊，而且如果你重新整理頁面，你在隊伍中的順位將會被重設。不是重新確認，不是重新查詢——是重設。你原本握著的號碼，無論是幾號，都回到隊伍最後面。",
        pitfall:
          "一個看起來凍住的排隊頁面，通常就只是一個排隊頁面。那個讓你感覺自己在做點什麼的動作，正是會把你已經等過的時間一筆抹掉的動作。",
        takes: "整段排隊期間",
      },
      {
        title: "一個帳號拿一個排隊號碼，而第二次嘗試會殺掉第一個",
        body: "每個帳號只能取得一個排隊號碼。如果你想拿更多——第二個瀏覽器、筆電旁邊再開手機——NOL World 會關閉你先取得的那個號碼。在已經排隊的狀態下從另一台裝置按下預約，系統會提示你保留既有的排隊或重新開始，而選擇重新開始就意味著在那台裝置上從頭再等一次。",
        pitfall:
          "開一台備用裝置是粉絲社群裡最常見的購票戰術，而在這裡它嚴格來說比什麼都不做更糟。跳出來的那個提示不是在給你第二次機會；它是在問你想丟掉哪一個。",
        takes: "0 分鐘，只要你忍住",
      },
      {
        title: "排隊號碼不是門票",
        body: "NOL World 表示，排隊中的順位並不保證能拿到票，因為數量有限且門票是依序發出的。排隊決定的是你什麼時候可以嘗試，不是你輪到時還剩不剩東西。排隊適用於 NOL World 上所有可預約的商品，不只是高需求的那些。",
        pitfall:
          "把一個很前面的排隊號碼當成結果。它是一個順位，而庫存可能在你輪到之前就沒了。",
        takes: "1 分鐘",
      },
      {
        title: "座位圖也不要重新整理——它會自己更新",
        body: "訂票系統經過重整，可選座位會即時更新而不需要重新載入。被其他使用者占住的座位會消失，被取消的座位會自己回來。如果你看到「此座位已被選擇」，意思是另一位使用者在幾乎同一瞬間選了同一個座位——不是你的頁面過期了。",
        pitfall:
          "重新整理座位圖的代價與重新整理排隊相同。從舊式售票網站帶來的習慣，在這裡正是完全相反的習慣。",
        takes: "選位期間",
      },
      {
        title: "把售完率理解成它實際在量的東西",
        body: "在有顯示售完率的地方，它只會在全部座位中有 90% 以上已完成付款之後才出現，而且它計算的是已付款的門票，不是可選的座位。剩餘座位數可能根本不會顯示：NOL World 表示這由主辦單位決定，而對高需求商品而言，顯示的數字與實際可售的數量之間存在延遲。",
        pitfall:
          "把售完百分比當成即時庫存。它是一個有 90% 下限的已付款票數，而它與現實之間的落差，恰好在你最在意的時候最大。",
        takes: "1 分鐘",
      },
      {
        title: "如果你收到候補通知，你有六小時",
        body: "如果候補的座位出現，而你沒有在通知後的六小時內完成付款，該預約會被自動取消並退款，機會則交給名單上的下一個人。六小時聽起來很寬裕，直到你想起通知是依韓國的上班時間發出的，而本頁多數讀者在其中一段時間裡正在睡覺。",
        pitfall:
          "一個在你當地凌晨三點開始的六小時視窗，實際上是兩小時的視窗。請用你換算開賣時間的方式，同樣去換算通知時間。",
        takes: "6 小時內",
      },
      {
        title: "要知道事後無法更換座位",
        body: "預約一旦完成，就無法更換座位——唯一的路是取消後重新訂票，而那會讓你承擔該場次的取消手續費，以及座位在這期間被搶走的風險。優惠券也一樣：付款之後無法再套用優惠券，而要用它就意味著取消並以同一個座位重新訂票，並承擔隨之而來的手續費。",
        pitfall:
          "抱著「之後再改」的想法訂下一個你不確定的座位。沒有之後。",
        takes: "在你確認之前",
      },
    ],
    faq: [
      {
        q: "重新整理能讓我更快通過 NOL World 的排隊嗎？",
        a: "正好相反。NOL World 表示重新整理頁面會重設你在隊伍中的順位，而且排隊無法被跳過。",
      },
      {
        q: "我可以同時在手機和筆電上排隊嗎？",
        a: "不行。一個帳號取得一個排隊號碼，而嘗試取得更多會關閉先取得的那一個。如果你在第二台裝置上按下預約，系統會問你要保留既有的排隊，還是在新裝置上從頭開始。",
      },
      {
        q: "我需要重新整理座位圖才看得到新座位嗎？",
        a: "不需要。座位會即時更新——被占住的座位會消失，被取消的座位會回來，都不需要重新載入。重新整理的代價和重新整理排隊一樣。",
      },
      {
        q: "售完率實際上代表什麼？",
        a: "它只在座位中有 90% 以上已完成付款時才出現，而且它計算的是已付款的門票，不是你可以選的座位。對高需求的場次而言，這個數字與實際可售數量之間存在已知的延遲。",
      },
      {
        q: "收到候補通知之後我有多久時間？",
        a: "六小時。如果沒有在那段時間內完成付款，該預約會被自動取消並退款，座位則交給候補名單上的下一個人。",
      },
    ],
    labels: ZH_LABELS,
  },
  {
    locale: "id",
    slug: "nol-world-queue-and-seat-selection",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Antrean NOL World, dan apa yang mengatur ulang posisi Anda di dalamnya",
    summary:
      "Menyegarkan halaman menghapus posisi Anda. Perangkat kedua menutup nomor pertama Anda. Kursi diperbarui tanpa perlu dimuat ulang. Semuanya ada di FAQ NOL World sendiri, dan semuanya berlawanan dengan apa yang orang lakukan secara naluriah.",
    scope:
      "Mencakup perilaku antrean, peta kursi, dan daftar tunggu NOL World selama penjualan. Pendaftaran dan verifikasi pelanggan luar negeri terjadi sebelum semua ini dan dibahas di panduan NOL World. Semua isi di sini berasal dari FAQ yang diterbitkan NOL World.",
    intro: [
      "Naluri dalam antrean tiket adalah menyegarkan halaman, dan membuka peramban kedua kalau-kalau yang pertama tersangkut. Di NOL World kedua tindakan itu justru merenggut hal yang sedang Anda coba lindungi, dan platformnya menyatakan itu di halaman bantuannya sendiri.",
      "Ini bagian dari sebuah penjualan yang tidak dibahas panduan mana pun, karena ia tidak bisa disimpulkan dari luar — Anda hanya melihatnya sekali, selama sembilan puluh detik, sambil panik.",
    ],
    steps: [
      {
        title: "Jangan segarkan halaman. Menyegarkan mengatur ulang posisi Anda",
        body: "NOL World menyatakannya terang-terangan: Anda tidak bisa melompati antrean, dan jika Anda menyegarkan halaman, posisi Anda di antrean akan diatur ulang. Bukan diperiksa ulang, bukan ditanyakan ulang — diatur ulang. Nomor berapa pun yang sedang Anda pegang kembali ke ujung belakang.",
        pitfall:
          "Halaman antrean yang terlihat membeku biasanya memang hanya halaman antrean. Satu tindakan yang terasa seperti melakukan sesuatu adalah satu tindakan yang membatalkan penantian yang sudah Anda jalani.",
        takes: "Sepanjang antrean",
      },
      {
        title: "Satu akun mendapat satu nomor antrean, dan percobaan kedua membunuh yang pertama",
        body: "Anda hanya bisa menerima satu nomor antrean per akun. Jika Anda mencoba lebih — peramban kedua, ponsel di samping laptop — NOL World menutup nomor pertama yang Anda terima. Menekan Reserve dari perangkat lain selagi sudah mengantre akan memunculkan pilihan untuk mempertahankan antrean yang ada atau memulai yang baru, dan memilih yang baru berarti menunggu lagi dari awal di perangkat itu.",
        pitfall:
          "Membuka perangkat cadangan adalah taktik tiket yang paling umum di komunitas fan dan di sini ia jelas lebih buruk daripada tidak melakukan apa pun. Pilihan yang muncul itu bukan menawarkan kesempatan kedua; ia menanyakan mana yang mau Anda buang.",
        takes: "0 menit, kalau Anda menahan diri",
      },
      {
        title: "Nomor antrean bukan tiket",
        body: "NOL World menyatakan posisi di antrean tidak menjamin tiket, karena ketersediaannya terbatas dan tiket dikeluarkan berurutan. Antrean menentukan kapan Anda boleh mencoba, bukan apakah masih ada sesuatu ketika giliran Anda datang. Antrean berlaku untuk setiap produk yang bisa dipesan di NOL World, bukan hanya yang permintaannya tinggi.",
        pitfall:
          "Membaca nomor antrean yang kecil sebagai hasil. Itu sebuah giliran, dan stoknya bisa habis sebelum giliran Anda tiba.",
        takes: "1 menit",
      },
      {
        title: "Berhenti menyegarkan peta kursi juga — ia memperbarui dirinya",
        body: "Sistem pemesanannya ditata ulang sehingga kursi yang tersedia diperbarui secara langsung tanpa dimuat ulang. Kursi yang ditahan pengguna lain menghilang dan kursi yang dibatalkan kembali dengan sendirinya. Jika Anda melihat “kursi ini sudah dipilih”, artinya pengguna lain memilih kursi yang sama pada saat yang nyaris bersamaan — bukan bahwa halaman Anda kedaluwarsa.",
        pitfall:
          "Menyegarkan peta kursi membawa biaya yang sama dengan menyegarkan antrean. Kebiasaan dari situs tiket lama justru kebiasaan yang salah di sini.",
        takes: "Selama pemilihan",
      },
      {
        title: "Baca angka sold-out sebagai apa yang sebenarnya ia ukur",
        body: "Di tempat angka sold-out ditampilkan, ia baru muncul setelah 90% atau lebih dari seluruh kursi sudah dibayar, dan ia menghitung tiket yang sudah dibayar, bukan kursi yang bisa dipilih. Jumlah kursi tersisa bisa jadi tidak ditampilkan sama sekali: NOL World menyatakan penyelenggaranya yang menentukan, dan bahwa untuk produk berpermintaan tinggi ada jeda antara apa yang ditampilkan dan apa yang sebenarnya tersedia.",
        pitfall:
          "Memperlakukan persentase sold-out sebagai stok langsung. Itu angka tiket terbayar dengan lantai 90%, dan jarak antara angka itu dan kenyataan paling lebar justru saat Anda paling peduli.",
        takes: "1 menit",
      },
      {
        title: "Kalau Anda dapat notifikasi daftar tunggu, Anda punya enam jam",
        body: "Jika kursi daftar tunggu menjadi tersedia dan pembayaran tidak diselesaikan dalam enam jam sejak notifikasi, pemesanannya otomatis dibatalkan dan dikembalikan, dan kesempatannya berpindah ke orang berikutnya di daftar. Enam jam terasa lapang sampai Anda ingat notifikasinya datang pada jam kerja Korea dan sebagian besar pembaca halaman ini sedang tidur selama sebagian dari waktu itu.",
        pitfall:
          "Jendela enam jam yang terbuka pada pukul tiga pagi di tempat Anda adalah jendela dua jam. Konversikan waktu notifikasinya dengan cara yang sama seperti Anda mengonversi waktu penjualan.",
        takes: "Dalam 6 jam",
      },
      {
        title: "Pahami bahwa Anda tidak bisa mengganti kursi sesudahnya",
        body: "Begitu pemesanan selesai, penggantian kursi tidak dimungkinkan — satu-satunya jalan adalah membatalkan dan memesan ulang, yang membuat Anda menanggung biaya pembatalan acara itu dan risiko kursinya diambil orang di sela-sela itu. Hal yang sama berlaku untuk kupon: kupon tidak bisa diterapkan setelah pembayaran, dan memakainya berarti membatalkan lalu memesan ulang kursi yang sama dengan biaya yang menyertainya.",
        pitfall:
          "Memesan kursi yang Anda tidak yakini dengan niat membetulkannya nanti. Tidak ada nanti.",
        takes: "Sebelum Anda mengonfirmasi",
      },
    ],
    faq: [
      {
        q: "Apakah menyegarkan halaman membantu saya melewati antrean NOL World lebih cepat?",
        a: "Justru sebaliknya. NOL World menyatakan bahwa menyegarkan halaman mengatur ulang posisi Anda di antrean, dan bahwa antreannya tidak bisa dilompati.",
      },
      {
        q: "Bisakah saya mengantre di ponsel dan laptop sekaligus?",
        a: "Tidak. Satu akun menerima satu nomor antrean, dan mencoba mendapat lebih akan menutup yang pertama. Jika Anda menekan Reserve di perangkat kedua, Anda akan ditanya apakah mau mempertahankan antrean yang ada atau mulai dari awal di perangkat baru itu.",
      },
      {
        q: "Apakah saya perlu menyegarkan peta kursi untuk melihat kursi baru?",
        a: "Tidak. Kursi diperbarui secara langsung — kursi yang ditahan menghilang dan kursi yang dibatalkan kembali tanpa dimuat ulang. Menyegarkan memakan biaya yang sama dengan menyegarkan antrean.",
      },
      {
        q: "Apa arti angka sold-out itu sebenarnya?",
        a: "Ia baru muncul ketika 90% atau lebih kursi sudah dibayar, dan ia menghitung tiket yang sudah dibayar, bukan kursi yang bisa Anda pilih. Untuk konser berpermintaan tinggi ada jeda yang diketahui antara angka itu dan ketersediaan sebenarnya.",
      },
      {
        q: "Berapa lama waktu saya setelah notifikasi daftar tunggu?",
        a: "Enam jam. Jika pembayaran tidak diselesaikan dalam waktu itu, pemesanannya otomatis dibatalkan dan dikembalikan, dan kursinya berpindah ke orang berikutnya di daftar tunggu.",
      },
    ],
    labels: ID_LABELS,
  },
  {
    locale: "zh-Hant",
    slug: "nol-world-cancel-ticket-refund",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "取消 NOL World 的票：期限、手續費，以及你仍然會損失的錢",
    summary:
      "取消期限是韓國時間演出前一天的下午，星期六比一週中其他日子更早，而一張全額退款的票，仍然可能讓持海外卡的人花到錢。另外：把票傳給朋友，會讓取消按鈕從你手上消失。",
    scope:
      "涵蓋在 NOL World 上取消演出門票，依 NOL World 自己的說明：各項期限、手續費顯示在哪裡、退款如何回到海外卡，以及什麼會讓取消變成不可能。NOL World 沒有公布統一的手續費表，本頁也不會憑空編一份。旅遊與體驗類商品遵循自己的政策，只在有差異時註明。",
    intro: [
      "海外粉絲取消的理由，是國內粉絲很少遇到的：簽證、轉機航班、被改動的班表。所以取消規則對這群讀者的重要性，高於它們原本被寫給的那群人——而這些規則嚴格、綁定時區，並且在兩個地方以沒有人會猜到的方式不對稱。",
      "以下其中兩個事實，值得在訂票之前就知道，而不是之後。星期六的演出，取消期限比其他每一天都早六小時。而一個被 NOL World 完整處理的取消，仍然可能讓持海外卡的人賠錢，那不是任何人的錯，也不是任何人有義務幫你解決的問題。",
    ],
    steps: [
      {
        title: "在訂票之前就搞清楚期限，因為它不是演出當天",
        body: "NOL World 在前一天就關閉演出的取消，不是當天：平日與假日是演出前一天的 KST（韓國時間）下午5點，星期六的演出則是前一天的 KST 上午11點。星期六那條規則就是會害到人的那一條——它比一週中其他日子早六小時，而且它適用於星期六的那場演出，所以期限落在 KST 的星期五早上。",
        pitfall:
          "用你自己的日曆去推算「前一天」。對首爾一場星期六傍晚的演出來說，KST 星期五上午11點是紐約的星期四傍晚。期限可能比它讀起來的時間整整早一天。",
        takes: "5 分鐘，在你付款之前",
      },
      {
        title: "如果你有點後悔，就用免費期間",
        body: "有一段不收手續費的期間，而且它很短：NOL World 表示就門票而言，在你預約當天的晚上11點59分之前取消，不收取消手續費。所以你能無代價反悔的決定，是你在訂票的同一天做的那個。過了午夜就要花錢。",
        pitfall:
          "以為那個晚上11點59分是你自己的午夜。NOL World 在其他取消期限上都明確寫出 KST，在這一條上沒有寫出時區，所以保險的讀法是韓國時間——而且不管怎樣，在一個期間的最後十分鐘做的決定，都是太晚做的決定。",
        takes: "—",
      },
      {
        title: "知道按鈕在哪裡，以及它不在時代表什麼",
        body: "路徑是 App 或網頁，然後 Account/My，然後 My Reservations，然後 Ticket Reservation List，然後點進那筆預約，然後在詳細頁上按 Cancel Reservation。如果詳細頁上根本沒有 Cancel Reservation 這個按鈕，NOL World 的指示是聯絡客服，而不是繼續找：客服人員會與供應商確認取消資格、手續費與退款金額，然後引導你。你可以從預約詳細頁追蹤這項申請，完成後會收到確認的電子郵件。",
        pitfall:
          "把按鈕消失讀成網站故障，然後重試一小時。那是一種狀態，而你重試的時候，第一步裡的那個時鐘還在走。",
        takes: "15 分鐘，加上客服處理時間",
      },
      {
        title: "不要期待有手續費表，請從你自己的預約取得數字",
        body: "沒有公開的手續費表可以用來規劃。被問到取消手續費是多少時，NOL World 回答的是一條路徑——Web/App、Account/My、My Reservations、Reservation Details——因為那個數字是你這筆訂單的屬性，不是平台的屬性。對旅遊與體驗類商品，手續費與退款金額會在你按下 Cancel Reservation 時、在你確認之前顯示給你。我們不會在這裡印一個你的預約可能並不同意的百分比。",
        pitfall:
          "照著某篇部落格文章的手續費表做規劃。任何為你那場演出引用固定韓國取消百分比的指南，引用的都是 NOL World 沒有公布的東西。",
        takes: "5 分鐘",
      },
      {
        title: "在你還在訂票的時候就確認能不能部分取消",
        body: "四個座位取消兩個，在某些演出可行、在某些不可行，而 NOL World 的指示是在你訂票的時候就確認部分取消的狀態——也就是說，在它變成你需要的東西之前。旅遊與體驗類商品則完全不允許：那裡的路是取消整筆訂單再重訂，而 NOL World 直白地警告，之後的可售狀況不受保證，重訂也可能無法成立。",
        pitfall:
          "抱著「那兩個還不確定的朋友之後可以退掉」的想法訂四個座位。對一場不支援部分取消的演出來說，選擇變成四個全要或一個都不要。",
        takes: "2 分鐘，在訂票時",
      },
      {
        title: "理解一次全額退款仍可能讓持海外卡的人花到錢",
        body: "這是為這群讀者而寫、而且在英文裡幾乎從沒被解釋過的部分。NOL World 表示，在使用海外信用卡的情況下，可能因為訂票日的匯率與取消日的匯率之間的差異而產生匯兌上的收益或損失——另外，即使交易已被取消，國際交易手續費仍可能被收取。這兩項都不是 NOL World 扣下的。兩項都在你的發卡機構，而 NOL World 的建議是向發卡機構詢問確切的匯率與費用。",
        pitfall:
          "把退回的金額小於扣款金額讀成錯誤或隱藏費用。那個落差可能是兩個日期之間的匯率變動，而能解釋它的人是你的銀行，不是售票平台。",
        takes: "打一通電話給你的銀行",
      },
      {
        title: "給退款卡片組織需要的時間",
        body: "如果這筆交易還沒送達你的信用卡公司，NOL World 表示取消會立即完成。如果已經送達，而且付款金額已經入帳，請預期卡片公司大約需要 5 到 7 天來沖銷它，而被取消的金額會從下個月的帳單中扣除，而不是以一筆退款的形式回來。NOL World 註明各卡片公司的退款政策不同，所以你的卡片公司才是它自己時程的權威。",
        pitfall:
          "在沖銷還在進行中的時候向銀行提出爭議。對一筆已經在被取消的交易提出爭議款，會在一個你可能還想拿來訂票的帳戶上製造第二個問題。",
        takes: "5-7 天",
      },
      {
        title: "在你確定要去之前，不要把電子票傳出去",
        body: "這是值得這整頁的那個陷阱。電子票分享功能讓購買者把票傳給實際入場的人——而 NOL World 表示，電子票一旦成功傳送，該筆預約的取消就會受到限制。回頭的路在收件者手上：如果他們把票解除登錄，取消就又變成可行。在登錄之前還有比較溫和的退路——票還未被登錄時，傳送方可以按 Cancel Send，而一張未被登錄的票會在 24 小時後或在觀看日之前自動退回。",
        pitfall:
          "在訂票的那一週就把票傳給朋友，當作是井井有條的做法。取消按鈕實質上已經是他們的了，而要拿回來，得先請他們放棄那張票。",
        takes: "—",
      },
      {
        title: "旅遊與體驗類商品的政策要分開讀",
        body: "如果你的訂單是旅遊、接送或體驗類商品，而不是演出門票，上面所有內容都不是安全的預設值。NOL World 表示其中有些商品一經購買就完全無法取消，而且即使在購買當天，也可能適用 100% 的取消手續費。有效的政策是該商品自己的詳細頁與憑證上的那一份，而 NOL World 要求你在送出取消申請之前先讀它。",
        pitfall:
          "把門票的規則套用到同一次下單中訂的套裝商品上。當天免費取消是演出門票的規則，而旅遊類商品可能從你付款的那一刻起就不可退。",
        takes: "每個商品 10 分鐘",
      },
    ],
    faq: [
      {
        q: "演出的取消期限究竟是什麼時候？",
        a: "演出前一天，以 KST（韓國時間）計。NOL World 給的是平日與假日為前一天的 KST 下午5點，星期六的演出為前一天的 KST 上午11點。請小心地對照你自己的日期換算——KST 星期五上午11點的期限，在美洲大部分地區是星期四傍晚。",
      },
      {
        q: "有任何免費取消嗎？",
        a: "就演出門票而言有，在你訂票的那一天：NOL World 表示在預約當天的晚上11點59分之前取消不收取消手續費。它在這一條上沒有寫出時區，卻在其他條上寫出 KST，所以請當成韓國時間，並且不要壓線。旅遊與體驗類商品不同——有些即使在當天也收 100%。",
      },
      {
        q: "取消手續費是多少？",
        a: "NOL World 沒有公布費率表。被問到這個問題時，它給的是一條路徑——Web 或 App、Account/My、My Reservations、Reservation Details——因為那個數字屬於你這筆訂單。對旅遊與體驗類商品，按下 Cancel Reservation 會在你確認之前顯示取消手續費與退款金額。任何為你那場演出引用固定百分比的英文指南，引用的都是平台沒有說過的數字。",
      },
      {
        q: "我及時取消了，拿回來的錢卻比付出去的少。剩下的去哪了？",
        a: "大概不是去了 NOL World。它表示海外卡可能因為訂票日與取消日的匯率差異而產生匯兌上的收益或損失，而且即使交易已被取消，國際交易手續費仍可能照收。這兩項都在你的發卡機構那邊，而 NOL World 自己的建議就是向發卡機構詢問確切的匯率與費用。",
      },
      {
        q: "錢要多久才會回來？",
        a: "如果這筆交易還沒送達你的卡片公司，取消會立即完成。如果已經送達，NOL World 表示卡片公司大約需要 5 到 7 天來取消這筆交易，金額會從下個月的帳單中扣除。各卡片公司不同，所以能告訴你的是你自己的那一家。",
      },
      {
        q: "我已經把電子票傳給朋友了。還能取消嗎？",
        a: "在他們持有它的期間不行。NOL World 表示電子票一旦成功傳送，該筆預約的取消就會受到限制，而如果收件者將它解除登錄，取消就又變成可行。如果票還沒有被登錄，你有比較輕鬆的退路：傳送方可以按 Cancel Send，而一張未被登錄的票會在 24 小時後或在觀看日之前自動退回。",
      },
      {
        q: "我可以只取消四個座位中的兩個嗎？",
        a: "這要看演出，而 NOL World 的建議是在你訂票時就確認部分取消的狀態，而不是在你需要它的時候。旅遊與體驗類商品完全不支援部分取消——你得取消整筆訂單再重訂，而且不保證庫存還在。",
      },
      {
        q: "我的預約頁面上沒有 Cancel Reservation 按鈕。",
        a: "NOL World 把那視為要交給客服的情況，而不是一個該重試的故障。客服人員會先與供應商確認資格、手續費與退款金額。請早一點聯絡他們，因為你等待的時候，第一個答案裡的那個期限還在走。",
      },
    ],
    labels: ZH_LABELS,
  },
  {
    locale: "id",
    slug: "nol-world-cancel-ticket-refund",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Membatalkan tiket NOL World: tenggatnya, biayanya, dan uang yang tetap hilang",
    summary:
      "Tenggat pembatalan jatuh pada sore hari sebelum konser dalam waktu Korea, hari Sabtu lebih awal daripada hari lain, dan tiket yang direfund penuh masih bisa memakan uang pemegang kartu luar negeri. Satu lagi: mengirim tiket ke teman Anda mencabut tombol pembatalannya.",
    scope:
      "Mencakup pembatalan tiket pertunjukan di NOL World, sebagaimana NOL World mendokumentasikannya: tenggat-tenggatnya, di mana biayanya ditampilkan, bagaimana refund mencapai kartu luar negeri, dan apa yang membuat pembatalan tidak mungkin. NOL World tidak menerbitkan daftar biaya terpusat dan halaman ini tidak mengarang satu. Produk tur dan aktivitas mengikuti kebijakannya sendiri dan hanya dicatat di tempat ia berbeda.",
    intro: [
      "Fan dari luar negeri membatalkan karena alasan yang jarang dimiliki fan domestik: visa, penerbangan lanjutan, jadwal kerja yang bergeser. Jadi aturan pembatalan lebih penting bagi pembaca ini daripada bagi mereka yang aturan itu ditulis untuknya — dan aturannya ketat, terikat zona waktu, dan di dua tempat tidak simetris dengan cara yang tak akan diduga siapa pun.",
      "Dua dari fakta di bawah ini layak diketahui sebelum Anda memesan, bukan sesudahnya. Konser hari Sabtu menutup pembatalan enam jam lebih awal daripada hari lain mana pun. Dan pembatalan yang diproses penuh oleh NOL World tetap bisa membuat pemegang kartu luar negeri kehilangan uang, yang bukan kesalahan siapa pun dan juga bukan masalah siapa pun untuk dibereskan bagi Anda.",
    ],
    steps: [
      {
        title: "Pelajari tenggatnya sebelum memesan, karena ia bukan hari konsernya",
        body: "NOL World menutup pembatalan pertunjukan pada hari sebelumnya, bukan pada hari-H: pukul 17.00 KST pada hari sebelum konser untuk hari kerja dan hari libur, dan pukul 11.00 KST pada hari sebelumnya untuk konser hari Sabtu. Aturan Sabtu itulah yang menjerat orang — ia enam jam lebih awal daripada sisa pekan, dan ia berlaku untuk pertunjukan hari Sabtu, jadi tenggatnya jatuh pada Jumat pagi waktu Korea.",
        pitfall:
          "Menghitung “hari sebelumnya” di kalender Anda sendiri. Untuk konser Sabtu malam di Seoul, pukul 11.00 KST hari Jumat adalah Kamis malam di New York. Tenggatnya bisa jatuh satu hari penuh lebih awal daripada bacaan sederhananya.",
        takes: "5 menit, sebelum Anda membayar",
      },
      {
        title: "Pakai jendela gratisnya kalau Anda mulai ragu",
        body: "Ada periode tanpa biaya, dan periode itu singkat: NOL World menyatakan bahwa untuk tiket, membatalkan sebelum pukul 23.59 pada hari pemesanan Anda berarti tanpa biaya pembatalan. Jadi keputusan yang bisa Anda tarik kembali tanpa biaya adalah keputusan yang Anda buat pada hari yang sama Anda memesan. Setelah tengah malam ia memakan biaya.",
        pitfall:
          "Menganggap pukul 23.59 itu tengah malam Anda sendiri. NOL World menyebut KST secara tegas pada tenggat pembatalan lainnya dan tidak menyebut zona apa pun pada yang satu ini, jadi bacaan yang aman adalah waktu Korea — dan bagaimanapun, keputusan yang dibuat pada sepuluh menit terakhir sebuah jendela adalah keputusan yang dibuat terlalu lambat.",
        takes: "—",
      },
      {
        title: "Tahu di mana tombolnya, dan apa artinya ketika ia tidak ada",
        body: "Rutenya adalah App atau Web, lalu Account/My, lalu My Reservations, lalu Ticket Reservation List, lalu pemesanannya, lalu Cancel Reservation di halaman detail. Jika tombol Cancel Reservation sama sekali tidak ada di halaman detail, instruksi NOL World adalah menghubungi layanan pelanggan alih-alih terus mencari: seorang petugas memastikan kelayakan pembatalan, biayanya, dan jumlah refund bersama penyedianya, lalu memandu Anda. Anda bisa mengikuti permintaannya dari halaman detail pemesanan, dan surel konfirmasi menyusul ketika ia selesai.",
        pitfall:
          "Membaca tombol yang hilang sebagai kerusakan situs dan mencobanya ulang selama satu jam. Itu sebuah status, dan jam di langkah pertama masih berjalan selagi Anda mencoba ulang.",
        takes: "15 menit, ditambah waktu layanan pelanggan",
      },
      {
        title: "Jangan harapkan daftar biaya, dan ambil angkanya dari pemesanan Anda sendiri",
        body: "Tidak ada tabel biaya yang diterbitkan untuk dijadikan dasar rencana. Ketika ditanya berapa biaya pembatalannya, NOL World menjawab dengan sebuah rute — Web/App, Account/My, My Reservations, Reservation Details — karena angkanya adalah sifat pemesanan Anda, bukan sifat platformnya. Untuk produk tur dan aktivitas, biayanya dan jumlah refundnya ditampilkan kepada Anda ketika Anda menekan Cancel Reservation, sebelum Anda mengonfirmasi. Kami tidak akan mencetak persentase di sini yang mungkin tidak disetujui pemesanan Anda.",
        pitfall:
          "Menyusun rencana di atas daftar biaya dari sebuah tulisan blog. Panduan mana pun yang mengutip persentase pembatalan Korea yang tetap untuk konser Anda sedang mengutip sesuatu yang tidak diterbitkan NOL World.",
        takes: "5 menit",
      },
      {
        title: "Periksa pembatalan sebagian selagi Anda masih memesan",
        body: "Membatalkan dua kursi dari empat dimungkinkan untuk sebagian konser dan tidak untuk sebagian lainnya, dan instruksi NOL World adalah memeriksa status pembatalan sebagian selagi Anda memesan — artinya, sebelum ia menjadi hal yang Anda butuhkan. Produk tur dan aktivitas tidak mengizinkannya sama sekali: di sana rutenya adalah membatalkan seluruh pemesanan lalu memesan ulang, dan NOL World memperingatkan terang-terangan bahwa ketersediaannya tidak dijamin sesudahnya dan pemesanan ulang bisa jadi tidak mungkin.",
        pitfall:
          "Memesan empat kursi dengan asumsi dua teman yang belum pasti bisa dilepas nanti. Untuk konser tanpa pembatalan sebagian, pilihannya menjadi keempatnya atau tidak satu pun.",
        takes: "2 menit, saat memesan",
      },
      {
        title: "Pahami bahwa refund penuh tetap bisa memakan uang pemegang kartu luar negeri",
        body: "Inilah bagian yang ditulis untuk pembaca ini dan hampir tidak pernah dijelaskan dalam bahasa Inggris. NOL World menyatakan bahwa ketika kartu kredit luar negeri dipakai, keuntungan atau kerugian selisih kurs bisa terjadi karena perbedaan antara kurs pada tanggal pemesanan dan kurs pada tanggal pembatalan — dan, secara terpisah, bahwa biaya transaksi internasional bisa tetap dikenakan meski transaksinya sudah dibatalkan. Keduanya bukan potongan yang dilakukan NOL World. Keduanya ada pada penerbit kartu Anda, dan saran NOL World adalah menanyakan kurs dan biaya yang tepat kepada penerbitnya.",
        pitfall:
          "Membaca jumlah refund yang lebih kecil daripada jumlah yang ditagih sebagai kesalahan atau biaya tersembunyi. Selisihnya bisa berupa kurs yang bergerak di antara dua tanggal, dan orang yang bisa menjelaskannya adalah bank Anda, bukan platform tiketnya.",
        takes: "Satu panggilan telepon ke bank Anda",
      },
      {
        title: "Beri refund itu waktu yang dibutuhkan jaringan kartu",
        body: "Jika transaksinya belum mencapai perusahaan kartu kredit Anda, NOL World menyatakan pembatalannya selesai seketika. Jika sudah, dan jumlah pembayarannya sudah terselesaikan, perkirakan kira-kira 5 sampai 7 hari bagi perusahaan kartu untuk membalikkannya, dan jumlah yang dibatalkan dipotong dari tagihan bulan berikutnya alih-alih dikembalikan sebagai pembayaran. NOL World mencatat kebijakan refund berbeda antar perusahaan kartu, jadi perusahaan Anda yang berwenang atas waktunya sendiri.",
        pitfall:
          "Membuka sengketa dengan bank Anda selagi pembalikannya sedang berjalan. Sebuah chargeback atas transaksi yang sudah sedang dibatalkan menciptakan masalah kedua pada akun yang mungkin masih Anda butuhkan untuk memesan lagi.",
        takes: "5-7 hari",
      },
      {
        title: "Jangan kirim tiket selulernya sampai Anda yakin akan pergi",
        body: "Inilah jebakan yang membuat seluruh halaman ini layak dibaca. Pembagian tiket seluler memungkinkan pembeli mengirim tiket kepada orang yang akan menghadiri — dan NOL World menyatakan bahwa begitu tiket seluler berhasil dikirim, pembatalan pemesanannya menjadi dibatasi. Jalan kembalinya ada pada penerimanya: jika mereka membatalkan pendaftaran tiket itu, pembatalan menjadi mungkin lagi. Sebelum pendaftaran ada jalan keluar yang lebih lembut — pengirim bisa menekan Cancel Send selagi tiketnya belum terdaftar, dan tiket yang belum terdaftar kembali otomatis setelah 24 jam atau pada tanggal menontonnya.",
        pitfall:
          "Mengirim tiket ke teman-teman di pekan Anda memesan, sebagai hal yang terasa rapi untuk dilakukan. Tombol pembatalannya sekarang praktis milik mereka, dan mengambilnya kembali berarti meminta mereka melepas tiketnya lebih dulu.",
        takes: "—",
      },
      {
        title: "Baca kebijakan tur dan aktivitas secara terpisah",
        body: "Jika pemesanan Anda berupa tur, antar-jemput, atau aktivitas alih-alih tiket pertunjukan, tidak ada satu pun dari yang di atas yang menjadi asumsi aman. NOL World menyatakan sebagian produk ini sama sekali tidak bisa dibatalkan setelah dibeli, dan bahwa biaya pembatalan 100% bisa berlaku bahkan pada hari pembelian. Kebijakan yang berlaku adalah yang ada di halaman detail produk itu sendiri dan di vouchernya, dan NOL World meminta Anda membacanya sebelum mengajukan permintaan pembatalan.",
        pitfall:
          "Membawa aturan tiket ke sebuah paket yang dipesan dalam sesi yang sama. Jendela gratis hari yang sama adalah aturan tiket pertunjukan, dan produk tur bisa tidak bisa direfund sejak detik Anda membayar.",
        takes: "10 menit per produk",
      },
    ],
    faq: [
      {
        q: "Tepatnya, kapan tenggat pembatalan untuk sebuah pertunjukan?",
        a: "Hari sebelum konsernya, dalam waktu Korea. NOL World memberi pukul 17.00 KST pada hari sebelumnya untuk hari kerja dan hari libur, dan pukul 11.00 KST pada hari sebelumnya untuk pertunjukan hari Sabtu. Konversikan dengan hati-hati terhadap tanggal Anda sendiri — tenggat pukul 11.00 KST hari Jumat adalah Kamis malam di sebagian besar Amerika.",
      },
      {
        q: "Apakah ada pembatalan gratis?",
        a: "Untuk tiket pertunjukan, ya, pada hari Anda memesan: NOL World menyatakan membatalkan sebelum pukul 23.59 pada hari pemesanan Anda tidak dikenai biaya pembatalan. NOL World tidak menyebut zona waktu pada yang satu itu sementara menyebut KST pada yang lain, jadi perlakukan sebagai waktu Korea dan jangan mepet. Produk tur dan aktivitas berbeda — sebagian menagih 100% bahkan pada hari yang sama.",
      },
      {
        q: "Berapa biaya pembatalannya?",
        a: "NOL World tidak menerbitkan daftarnya. Ketika ditanya begitu, ia memberi sebuah rute — Web atau App, Account/My, My Reservations, Reservation Details — karena angkanya milik pemesanan Anda. Untuk produk tur dan aktivitas, menekan Cancel Reservation menampilkan biaya pembatalan dan jumlah refund kepada Anda sebelum Anda mengonfirmasi. Panduan berbahasa Inggris mana pun yang mengutip persentase tetap untuk konser Anda sedang mengutip angka yang tidak dinyatakan platformnya.",
      },
      {
        q: "Saya membatalkan tepat waktu dan menerima kembali lebih sedikit daripada yang saya bayar. Ke mana sisanya?",
        a: "Kemungkinan bukan ke NOL World. NOL World menyatakan bahwa kartu luar negeri bisa menghasilkan keuntungan atau kerugian selisih kurs dari perbedaan antara kurs tanggal pemesanan dan tanggal pembatalan, dan bahwa biaya transaksi internasional bisa tetap dikenakan meski transaksinya dibatalkan. Keduanya ada pada penerbit kartu Anda, dan saran NOL World sendiri adalah menanyakan kurs dan biaya yang tepat kepada penerbitnya.",
      },
      {
        q: "Berapa lama uangnya kembali?",
        a: "Jika transaksinya belum mencapai perusahaan kartu Anda, pembatalannya selesai seketika. Jika sudah, NOL World menyatakan kira-kira 5 sampai 7 hari bagi perusahaan kartu untuk membatalkan transaksinya, dengan jumlahnya dipotong dari tagihan bulan berikutnya. Perusahaan kartu berbeda-beda, jadi perusahaan Anda yang bisa memberi tahu Anda.",
      },
      {
        q: "Saya sudah mengirim tiket selulernya ke teman saya. Masih bisa membatalkan?",
        a: "Tidak selagi mereka memegangnya. NOL World menyatakan pembatalan pemesanan menjadi dibatasi begitu tiket seluler berhasil dikirim, dan menjadi mungkin lagi jika penerimanya membatalkan pendaftarannya. Jika tiketnya belum terdaftar, Anda punya jalan keluar yang lebih mudah: pengirim bisa menekan Cancel Send, dan tiket yang belum terdaftar kembali otomatis setelah 24 jam atau pada tanggal menontonnya.",
      },
      {
        q: "Bisakah saya membatalkan dua dari empat kursi saya?",
        a: "Itu bergantung pada konsernya, dan saran NOL World adalah memeriksa status pembatalan sebagian saat Anda memesan alih-alih saat Anda membutuhkannya. Produk tur dan aktivitas tidak mendukung pembatalan sebagian sama sekali — Anda harus membatalkan seluruh pemesanan lalu memesan ulang, tanpa jaminan stoknya masih ada.",
      },
      {
        q: "Tombol Cancel Reservation tidak ada di halaman pemesanan saya.",
        a: "NOL World memperlakukan itu sebagai kasus untuk layanan pelanggan alih-alih kerusakan untuk dicoba ulang. Seorang petugas memastikan kelayakan, biaya, dan jumlah refundnya bersama penyedianya lebih dulu. Hubungi mereka lebih awal, karena tenggat di jawaban pertama terus berjalan selagi Anda menunggu.",
      },
    ],
    labels: ID_LABELS,
  },
  {
    locale: "zh-Hant",
    slug: "nol-world-mobile-ticket-and-entry",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "你的 NOL World 電子票：QR、PIN，以及順利通過入場閘口",
    summary:
      "票只在手機上開得起來，它只有英文，而你瀏覽器的自動翻譯會把它搞爛；傳出去的票有一個 24 小時的 PIN 時鐘，而遲到不保證進得去。整段流程的最後二十分鐘，按順序排好。",
    scope:
      "涵蓋 NOL World 的電子票與入場，依 NOL World 自己的說明：票在哪裡打開、哪兩種瀏覽器狀態會把它藏起來、傳送與接收以及 PIN 的時鐘、代理領取，還有遲到。入場規則按場次設定，而現場由場館在當晚決定。人臉辨識入場是另一條流程，有自己的指南。",
    intro: [
      "本站其他所有內容都是準備工作。這裡是機票、飯店與先行販售究竟會不會變成一個座位的那一段，而它跑在一支你在人群中、訊號很差的情況下握著的手機上。",
      "這裡出錯的多數情況都不戲劇性。是一個處於錯誤模式的瀏覽器，在該出現票的地方顯示了一個 QR 碼；是一個翻譯擴充功能改寫了閘口號碼；是一個在朋友睡著時過期的 PIN。這四種 NOL World 都有記錄，而這四種都能在前一晚避免掉。",
    ],
    steps: [
      {
        title: "搞清楚你手上實際握著的是哪一種票",
        body: "領取方式在你訂票時就決定了，而它決定了以下的一切。電子票存在你的帳號裡，從你的螢幕上被掃描。現場領取意味著在演出當天從售票口拿到一張紙本票，而 NOL World 不會提早發放——窗口在開演前一小時開放，而已領取的票若遺失或遭竊無法補發。現在就確認你是哪一種，不要到了場館才確認。",
        pitfall:
          "因為上一場演唱會用的是電子票，就假設每一筆訂單都是電子票。這是逐筆訂單的屬性，而這兩條路線的失敗方式完全不同。",
        takes: "5 分鐘",
      },
      {
        title: "在你要用來入場的那支手機上打開電子票",
        body: "NOL World 表示電子票只能在 NOL World App 或行動版網頁上取得。入場靠票上的 QR 碼。在手機上的路徑是 App 或行動版網頁、登入、Account/My、My Reservations，然後按 Mobile Ticket。在桌機上，同一個按鈕產生的 QR 碼並不是你的票——它是一個交接碼，設計上是要用你的手機掃描，讓票在手機上打開。",
        pitfall:
          "把票截圖當備份，打算出示那張圖片。一張在帳號中即時繪製出來的票，和一張票的照片不是同一個東西，而閘口不是你想發現這個差別的地方。",
        takes: "10 分鐘，前一晚",
      },
      {
        title: "出門前關掉瀏覽器翻譯",
        body: "NOL World 表示電子票只以英文提供，而如果你看到其他語言，那是你瀏覽器的自動翻譯——解法是關掉翻譯並重新載入頁面。對這群讀者來說，那是瀏覽器的預設狀態，而不是罕見的例外。一個自動翻譯器改寫了閘口、區塊或座位排號，是一個你不會察覺的問題，直到門口的人把它讀回給你聽。",
        pitfall:
          "因為整趟旅程它都很有幫助，就讓翻譯一直開著。它一路在幫你翻譯韓文頁面；在這裡頁面本來就是英文，它唯一能做的事就是破壞。",
        takes: "2 分鐘",
      },
      {
        title: "如果該出現票的地方出現 QR 碼，請修正瀏覽器模式",
        body: "這是票看起來不見了最常見的單一原因，而它不是故障。NOL World 表示如果你的瀏覽器處於桌面模式，顯示的會是一個 QR 碼而不是電子票——而那個 QR 碼下方有一個 View Tickets 按鈕，按了照樣能打開票。否則就把瀏覽器切到行動模式：在 Chrome 裡，三點選單裡的「View as mobile version」；在 Safari 裡，網址欄左側的語言按鈕裡的「Request Mobile Website」；在 Samsung Internet 裡，三線選單裡的「Mobile site」。",
        pitfall:
          "讓閘口的人去掃那個 QR 碼。那是桌面版的交接碼，不是你的入場碼，而你需要的東西就在它下面一按之處。",
        takes: "2 分鐘",
      },
      {
        title: "了解把票傳出去意味著你承諾了什麼",
        body: "電子票分享是單向的：購買者傳給實際入場的人，而 NOL World 表示收到的票無法再往下傳——只有自己訂的票可以傳送。傳送在活動當天之前都還可行。並非每個商品都提供它；在賣方沒有開放的地方，Send 按鈕就是不存在。而傳送的代價是你自己的退路：票一旦成功傳送，NOL World 就會限制該筆預約的取消，只有在收件者解除登錄時才恢復。",
        pitfall:
          "在訂票的那一週就把每個人的票都傳出去來組織團體。你剛剛交給了每一個人一張對取消那筆預約的否決權。",
        takes: "5 分鐘",
      },
      {
        title: "如果你是收票的人，把 PIN 當成一個 24 小時的時鐘",
        body: "收到的票在被登錄之前不能使用，而那段期間很短。NOL World 表示 PIN 只能在傳送後的 24 小時內登錄，而未登錄的票在那之後會退回給傳送方——或者在觀看日之前仍未被登錄時也會退回。登錄從訊息或電子郵件裡的網址開始：Received Mobile Ticket、Ticket Register，然後輸入訊息裡的 PIN。之後票會存在 My Page、Received Mobile Ticket、Booking History 底下。退回是同一條路徑加上 Return 按鈕，而 NOL World 表示已登錄的票仍然可以退回。",
        pitfall:
          "傳給一個所在時區讓那 24 小時幾乎全是夜晚的朋友。票會無聲地彈回給你，而預約又變成你的了——這在星期二沒問題，在演出當天早上就有問題。",
        takes: "5 分鐘，在 24 小時內",
      },
      {
        title: "在假設別人可以幫你領票之前，先看場次頁面",
        body: "NOL World 確實允許非購買者領票，但附帶實際的條件。流程依場館而異，代理領取可能依演出類型而受限，而 NOL World 的指示是去看你所訂那場演出詳細頁上的公告。對方需要的是從 My Ticket 列印出來的訂單明細、確認編號，以及購買者的身分證件。請把最後那項要求當成它本來的界限：在一場以購買者本人已驗證身分來管制入場的演出上，不要把計畫押在代理領取上。",
        pitfall:
          "把代理領取讀成一般性的權利。它是逐場館、逐場次的許可，而最可能拒絕它的演出，恰好就是那些你需要先行販售才搶得到的高需求場次。",
        takes: "10 分鐘",
      },
      {
        title: "不要把遲到當成你還保有那個座位",
        body: "NOL World 明確表示開演後能否入場視演出而定，而有些演出根本不允許——它特別點名古典音樂會與歌劇。在允許遲到入場的地方，它可能意味著等到中場休息，然後看下半場。而即使你被放進去了，NOL World 表示你可能要等到中場休息才能坐到自己的座位，所以遲到可能意味著在你專程來看的那一段裡站著，或坐在別的地方。",
        pitfall:
          "從開演時間回推你的抵達時間。請從入場排隊、安全檢查與領票窗口回推，這些全都發生在開演時間之前，而且沒有一個會等你。",
        takes: "—",
      },
    ],
    faq: [
      {
        q: "該出現我的票的地方出現了一個 QR 碼。我的訂單壞了嗎？",
        a: "沒有——你的瀏覽器處於桌面模式。NOL World 表示那會在電子票的位置產生一個 QR 碼，而它下方有一個 View Tickets 按鈕可以打開票。你也可以把瀏覽器切到行動模式：Chrome 的三點選單裡有「View as mobile version」，Safari 的語言按鈕提供「Request Mobile Website」，而 Samsung Internet 的三線選單裡有「Mobile site」。",
      },
      {
        q: "我的電子票顯示的語言不對。",
        a: "NOL World 只以英文提供電子票，所以出現其他語言意味著你的瀏覽器正在自動翻譯。請關掉翻譯並重新載入。這值得在出發前做，而不是在閘口做，因為被翻譯過的閘口號碼或座位排號，是一種很難察覺的錯。",
      },
      {
        q: "我可以在門口用筆電出示票嗎？",
        a: "NOL World 表示電子票只能在 App 或行動版網頁上取得。在桌機上，Mobile Ticket 按鈕給你的是一個要用手機掃描的 QR 碼，掃了之後票才會在手機上打開。請規劃用手機入場。",
      },
      {
        q: "我朋友可以到售票口幫我領票嗎？",
        a: "有時候可以。NOL World 表示非購買者可以領取，但流程依場館而異，而且代理領取可能依演出類型而受限——所以你那場演出詳細頁上的公告才是權威。對方需要從 My Ticket 列印出來的訂單明細、確認編號，以及購買者的身分證件。在入場時會驗證購買者身分的演出上，不要依賴它。",
      },
      {
        q: "我不小心把電子票傳出去了。可以收回來嗎？",
        a: "如果收件者還沒登錄它，可以——NOL World 表示傳送方可以用 Cancel Send 按鈕取消分享。如果收件者沒有在 24 小時內或在觀看日之前完成登錄，它也會自動退回。一旦被登錄，要拿回來就得靠他們的動作：他們從 My Page、Received Mobile Ticket、Booking History、Mobile Ticket、Return 退回。",
      },
      {
        q: "如果我朋友一直沒有登錄我傳過去的票，會怎樣？",
        a: "它會回到你這裡。NOL World 表示未登錄的票會在 24 小時後自動退回給傳送方，或者在觀看日之前仍未被登錄時退回。那會恢復你的預約——依它的取消規則，也包括你取消它的能力——但那是一個無聲的過程，所以請去確認，不要假設。",
      },
      {
        q: "我會遲到二十分鐘。他們會讓我進去嗎？",
        a: "這要看演出，而沒有人能保證。NOL World 表示開演後能否入場視演出而定，而有些根本不允許，尤其是古典音樂會與歌劇；在允許的地方，你可能必須等到中場休息，而且在那之前可能無法坐到自己的座位。",
      },
      {
        q: "電子票和人臉辨識入場是同一回事嗎？",
        a: "不是。NOL facepass 是另一套系統，門口的攝影機不經票券查驗就讓你進場，而對它的支援是逐場次設定的。電子票與它的 QR 碼是一般路線，而且即使你已經登錄了人臉，也是該保持能用的那一條。",
      },
    ],
    labels: ZH_LABELS,
  },
  {
    locale: "id",
    slug: "nol-world-mobile-ticket-and-entry",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Tiket seluler NOL World Anda: QR-nya, PIN-nya, dan melewati pintu masuk",
    summary:
      "Tiketnya hanya terbuka di ponsel, ia hanya berbahasa Inggris dan terjemahan otomatis peramban Anda akan mengacaukannya, tiket yang dikirim punya jam PIN 24 jam, dan datang terlambat bukan jaminan bisa masuk. Dua puluh menit terakhir dari seluruh proses, berurutan.",
    scope:
      "Mencakup tiket seluler dan masuk venue di NOL World sebagaimana NOL World mendokumentasikannya: di mana tiketnya terbuka, dua keadaan peramban yang menyembunyikannya, mengirim dan menerima beserta jam PIN-nya, pengambilan oleh orang lain, dan keterlambatan. Aturan masuk ditetapkan per konser dan venue yang memutuskan pada malam itu. Masuk dengan pengenalan wajah adalah alur terpisah dengan panduannya sendiri.",
    intro: [
      "Semua hal lain di situs ini adalah persiapan. Inilah bagian di mana sebuah penerbangan, sebuah hotel, dan sebuah presale berubah menjadi sebuah kursi atau tidak, dan ia berjalan di ponsel yang Anda pegang di tengah kerumunan dengan sinyal buruk.",
      "Sebagian besar yang salah di sini tidak dramatis. Ia berupa peramban dalam mode yang salah yang menampilkan kode QR di tempat tiketnya seharusnya ada, sebuah ekstensi terjemahan yang menulis ulang nomor pintu, sebuah PIN yang kedaluwarsa selagi seorang teman tertidur. Keempatnya didokumentasikan NOL World dan keempatnya bisa dihindari pada malam sebelumnya.",
    ],
    steps: [
      {
        title: "Ketahui jenis tiket mana yang sebenarnya Anda pegang",
        body: "Metode penyerahannya ditentukan ketika Anda memesan, dan metode itu menentukan segala hal di bawah ini. Tiket seluler ada di dalam akun Anda dan dipindai dari layar Anda. Pengambilan di venue berarti tiket kertas dari loket pada hari konsernya, dan NOL World tidak melepaskannya lebih awal — jendelanya terbuka satu jam sebelumnya, dan tiket yang sudah diambil tidak bisa diterbitkan ulang jika hilang atau dicuri. Periksa Anda punya yang mana sekarang, bukan di venue.",
        pitfall:
          "Mengira setiap pemesanan adalah tiket seluler karena itulah yang dipakai konser terakhir. Itu sifat per pemesanan, dan kedua rute itu gagal dengan cara yang sepenuhnya berbeda.",
        takes: "5 menit",
      },
      {
        title: "Buka tiket selulernya di ponsel yang akan Anda pakai masuk",
        body: "NOL World menyatakan tiket seluler hanya tersedia di aplikasi NOL World atau web seluler. Masuk dilakukan dengan kode QR di tiketnya. Rutenya di ponsel adalah aplikasi atau web seluler, masuk ke akun, Account/My, My Reservations, lalu tombol Mobile Ticket. Di komputer, tombol yang sama menghasilkan kode QR yang bukan tiket Anda — itu sebuah penyerahan, dimaksudkan untuk dipindai dengan ponsel Anda agar tiketnya terbuka di sana.",
        pitfall:
          "Menangkap layar tiketnya sebagai cadangan dan berencana menunjukkan gambarnya. Tiket yang dirender langsung di dalam sebuah akun bukan benda yang sama dengan foto sebuah tiket, dan pintu masuk bukan tempat Anda ingin menemukan perbedaannya.",
        takes: "10 menit, pada malam sebelumnya",
      },
      {
        title: "Matikan terjemahan peramban sebelum Anda pergi",
        body: "NOL World menyatakan tiket seluler disediakan hanya dalam bahasa Inggris, dan bahwa jika Anda melihat bahasa lain itu adalah terjemahan otomatis peramban Anda — dengan solusinya mematikan terjemahan lalu memuat ulang halamannya. Bagi pembaca ini, itu keadaan bawaan peramban, bukan kasus pinggiran. Penerjemah otomatis yang menulis ulang sebuah pintu, blok, atau baris kursi adalah masalah yang tidak akan Anda sadari sampai seseorang di pintu membacakannya kembali kepada Anda.",
        pitfall:
          "Membiarkan terjemahan menyala karena ia membantu sepanjang perjalanan. Ia sudah menerjemahkan halaman berbahasa Korea untuk Anda; di sini halamannya sudah berbahasa Inggris dan satu-satunya yang bisa ia lakukan adalah merusak.",
        takes: "2 menit",
      },
      {
        title: "Kalau Anda melihat kode QR di tempat tiketnya seharusnya ada, perbaiki mode peramban",
        body: "Inilah cara paling umum sebuah tiket tampak hilang, dan itu bukan kerusakan. NOL World menyatakan bahwa jika peramban Anda dalam mode desktop, yang ditampilkan adalah kode QR alih-alih tiket selulernya — dan bahwa ada tombol View Tickets di bawah kode QR itu yang tetap membuka tiketnya. Kalau tidak, alihkan peramban ke mode seluler: di Chrome, menu tiga titik lalu View as mobile version; di Safari, tombol bahasa di sebelah kiri bilah alamat lalu Request Mobile Website; di Samsung Internet, menu tiga garis lalu Mobile site.",
        pitfall:
          "Membiarkan orang di pintu memindai kode QR itu. Itu kode penyerahan versi desktop, bukan kode masuk Anda, dan yang Anda butuhkan ada satu ketukan di bawahnya.",
        takes: "2 menit",
      },
      {
        title: "Pahami apa yang Anda ikat ketika mengirim sebuah tiket",
        body: "Pembagian tiket seluler berjalan satu arah: pembeli mengirim kepada yang menghadiri, dan NOL World menyatakan tiket yang diterima tidak bisa dikirim lagi — hanya tiket yang dipesan sendiri yang bisa dikirim. Pengiriman tetap mungkin sampai hari acaranya. Tidak setiap produk menyediakannya; di tempat penjualnya menahannya, tombol Send memang tidak ada. Dan biaya dari mengirim adalah jalan keluar Anda sendiri: begitu sebuah tiket berhasil dikirim, NOL World membatasi pembatalan pemesanannya, yang hanya kembali jika penerimanya membatalkan pendaftaran.",
        pitfall:
          "Mengatur satu kelompok dengan mengirimkan tiket masing-masing orang di pekan Anda memesan. Anda baru saja menyerahkan hak veto atas pembatalan pemesanan itu kepada setiap orang.",
        takes: "5 menit",
      },
      {
        title: "Kalau Anda yang menerima tiket, perlakukan PIN-nya sebagai jam 24 jam",
        body: "Tiket yang diterima belum bisa dipakai sampai ia didaftarkan, dan jendelanya singkat. NOL World menyatakan PIN hanya bisa didaftarkan dalam 24 jam sejak pengiriman, dan bahwa tiket yang belum terdaftar kembali kepada pengirimnya setelah itu — atau jika ia belum terdaftar pada tanggal menontonnya. Pendaftarannya berjalan dari URL di dalam pesan atau surel: Received Mobile Ticket, Ticket Register, lalu PIN dari pesannya. Sesudahnya tiketnya berada di bawah My Page, Received Mobile Ticket, Booking History. Mengembalikannya memakai jalur yang sama dengan tombol Return, dan NOL World menyatakan tiket yang sudah terdaftar masih bisa dikembalikan.",
        pitfall:
          "Mengirim kepada teman di zona waktu yang membuat 24 jam itu sebagian besar berupa malam. Tiketnya memantul kembali kepada Anda tanpa suara dan pemesanannya menjadi milik Anda lagi, yang tidak masalah pada hari Selasa dan sangat bermasalah pada pagi hari konsernya.",
        takes: "5 menit, di dalam 24 jam",
      },
      {
        title: "Periksa halaman konsernya sebelum mengira orang lain bisa mengambilkan untuk Anda",
        body: "NOL World memang mengizinkan orang yang bukan pembeli mengambil tiket, dengan syarat yang nyata. Prosesnya berbeda menurut venue, pengambilan oleh orang lain bisa dibatasi tergantung jenis konsernya, dan instruksi NOL World adalah memeriksa pemberitahuan di halaman detail konser yang Anda pesan. Yang dibutuhkan orang itu adalah detail pemesanan yang dicetak dari My Ticket, nomor konfirmasinya, dan identitas pembelinya. Perlakukan syarat terakhir itu sebagai batas yang sebenarnya: pada konser yang mengatur masuk berdasarkan identitas terverifikasi pembelinya sendiri, jangan menyusun rencana di atas pengambilan oleh orang lain.",
        pitfall:
          "Membaca pengambilan oleh orang lain sebagai hak umum. Itu kelonggaran per venue dan per konser, dan konser yang paling mungkin menolaknya justru konser berpermintaan tinggi yang membuat Anda butuh presale.",
        takes: "10 menit",
      },
      {
        title: "Jangan anggap keterlambatan sebagai kursi yang masih Anda punya",
        body: "NOL World tegas bahwa masuk setelah konser dimulai bergantung pada konsernya, dan bahwa sebagian pertunjukan sama sekali tidak mengizinkannya — menyebut konser klasik dan opera secara khusus. Di tempat masuk terlambat dimungkinkan, itu bisa berarti menunggu jeda istirahat dan menonton paruh kedua. Dan bahkan ketika Anda dipersilakan masuk, NOL World menyatakan Anda bisa jadi belum boleh menempati kursi Anda sampai jeda istirahat, sehingga keterlambatan bisa berarti berdiri atau duduk di tempat lain sepanjang bagian yang Anda datang untuk menontonnya.",
        pitfall:
          "Menghitung waktu kedatangan dari jam mulainya. Hitunglah dari antrean masuk, pemeriksaan keamanan, dan jendela pengambilan tiket, yang semuanya terjadi sebelum jam mulai dan tidak satu pun menunggu.",
        takes: "—",
      },
    ],
    faq: [
      {
        q: "Ada kode QR di tempat tiket saya seharusnya ada. Apakah pemesanan saya rusak?",
        a: "Tidak — peramban Anda dalam mode desktop. NOL World menyatakan itu menghasilkan kode QR sebagai ganti tiket selulernya, dan bahwa ada tombol View Tickets di bawahnya yang membuka tiketnya. Anda juga bisa mengalihkan peramban ke mode seluler: menu tiga titik Chrome punya View as mobile version, tombol bahasa Safari menawarkan Request Mobile Website, dan menu tiga garis Samsung Internet punya Mobile site.",
      },
      {
        q: "Tiket seluler saya tampil dalam bahasa yang salah.",
        a: "NOL World menyediakan tiket seluler hanya dalam bahasa Inggris, jadi bahasa lain berarti peramban Anda sedang menerjemahkan otomatis. Matikan terjemahannya lalu muat ulang. Layak dilakukan sebelum Anda berangkat alih-alih di pintu masuk, karena nomor pintu atau baris kursi yang diterjemahkan salah dengan cara yang sulit dikenali.",
      },
      {
        q: "Bisakah saya menunjukkan tiketnya dari laptop di pintu?",
        a: "NOL World menyatakan tiket seluler hanya tersedia di aplikasi atau web seluler. Di komputer, tombol Mobile Ticket memberi Anda kode QR untuk dipindai dengan ponsel, yang lalu membuka tiket sebenarnya di sana. Rencanakan untuk masuk dengan ponsel.",
      },
      {
        q: "Bisakah teman saya mengambil tiket saya di loket?",
        a: "Kadang bisa. NOL World menyatakan orang yang bukan pembeli bisa mengambil, tetapi prosesnya berbeda menurut venue dan pengambilan oleh orang lain bisa dibatasi tergantung jenis konsernya — jadi pemberitahuan di halaman detail konser Anda yang berwenang. Mereka akan membutuhkan detail pemesanan yang dicetak dari My Ticket, nomor konfirmasinya, dan identitas pembelinya. Pada konser yang memverifikasi identitas pembeli saat masuk, jangan mengandalkannya.",
      },
      {
        q: "Saya mengirim tiket seluler karena keliru. Bisakah saya menariknya kembali?",
        a: "Jika penerimanya belum mendaftarkannya, ya — NOL World menyatakan pengirim bisa membatalkan pembagiannya dengan tombol Cancel Send. Ia juga kembali otomatis jika penerimanya tidak mendaftar dalam 24 jam atau pada tanggal menontonnya. Begitu terdaftar, mengambilnya kembali adalah tindakan mereka: mereka mengembalikannya dari My Page, Received Mobile Ticket, Booking History, Mobile Ticket, Return.",
      },
      {
        q: "Apa yang terjadi kalau teman saya tidak pernah mendaftarkan tiket yang saya kirim?",
        a: "Ia kembali kepada Anda. NOL World menyatakan tiket yang belum terdaftar otomatis dikembalikan kepada pengirimnya setelah 24 jam, atau jika ia belum terdaftar pada tanggal menontonnya. Itu memulihkan pemesanan Anda — termasuk, menurut aturan pembatalannya, kemampuan Anda membatalkannya — tetapi itu proses yang tanpa suara, jadi periksalah alih-alih mengira.",
      },
      {
        q: "Saya akan terlambat dua puluh menit. Apakah mereka akan membiarkan saya masuk?",
        a: "Itu bergantung pada konsernya dan tidak ada yang bisa menjanjikannya. NOL World menyatakan masuk setelah konser dimulai bergantung pada pertunjukannya dan bahwa sebagian sama sekali tidak mengizinkannya, terutama konser klasik dan opera; di tempat ia diizinkan, Anda mungkin harus menunggu jeda istirahat, dan Anda mungkin belum boleh menempati kursi Anda sendiri sampai saat itu.",
      },
      {
        q: "Apakah tiket seluler itu sama dengan masuk lewat pengenalan wajah?",
        a: "Bukan. NOL facepass adalah sistem terpisah di mana kamera di pintu mempersilakan Anda masuk tanpa pemeriksaan tiket, dan dukungan untuknya ditetapkan per acara. Tiket seluler dan kode QR-nya adalah rute biasa, dan rute yang harus tetap berfungsi bahkan jika Anda sudah mendaftarkan wajah.",
      },
    ],
    labels: ID_LABELS,
  },
  {
    locale: "zh-Hant",
    slug: "nol-world-play-stay-package",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "NOL World Play&Stay：一個商品，而且幾乎沒有一處可以改",
    summary:
      "演唱會與飯店作為單一商品販售。你不能換飯店、不能改日期、不能改晚數；不去住飯店退不回任何錢；座位是隨機的，而且當天才公布；而票只會親手交給你本人，在飯店，在一段指定時間內。",
    scope:
      "涵蓋 NOL World 的 Play and Stay 演唱會加住宿套裝，依 NOL World 自己的說明：哪些是固定的、票怎麼領、身分與姓名的要求，以及它關於取消的回答實際上說了什麼。每一個套裝都有自己的取消政策與內容物，而商品頁的效力最高。接駁服務只在套裝含有時才註明。",
    intro: [
      "套裝看起來是輕鬆的選項：付一次錢、一間離場館近的飯店、保證的座位等級、不必跟排隊搏鬥。對一個只有一次機會成行的海外粉絲來說，那是一個真的很有吸引力的交換。",
      "它同時也是這個平台上最僵硬的商品，而那份僵硬從商品頁上看不出來。把 NOL World 自己的回答一條一條連著讀，一個模式就浮出來了：這個套裝是一個不可分割的商品。不是一張票加一間你可以分別最佳化的飯店房間——是一個東西，買一次，幾乎哪裡都改不了。以下所有內容都是從這一個事實衍生出來的，包括那些在你真正需要時會覺得不公平的部分。",
    ],
    steps: [
      {
        title: "理解你買的是一個商品，不是兩筆訂單",
        body: "這一步就是整份指南。NOL World 表示套裝中的住宿晚數無法變更，套裝所指定的入住與退房日期無法變更，而且不允許更換飯店。購買時也不能加晚數——額外的住宿是另外跟飯店談的事，按飯店的價格、受飯店的空房狀況限制。而且一個帳號只能買一個商品，所以這不是可以疊加的東西。",
        pitfall:
          "抱著「細節之後再整理」的想法訂下套裝：提前一天到、換到離朋友更近的飯店、把最後一晚砍掉。這每一項都是被明文記錄的「不行」。",
        takes: "15 分鐘，在你付款之前",
      },
      {
        title: "接受不去住飯店退不回任何錢",
        body: "這個問題在 NOL World 的 FAQ 裡以兩種方式被問到，兩次都得到同樣的答案：你可以選擇不住那間飯店，但飯店部分不提供退款，而且該筆預約不可轉讓給他人。所以改住朋友家並不會換成退回來的錢，而你付過錢的那間房也不能轉給任何人。只住一晚然後要求退回其餘的晚數同樣被拒絕——晚數是固定的。",
        pitfall:
          "把飯店那一半當成可以一走了之的押金。那正是你不能轉售、不能送人、也不能要回來的那一半。",
        takes: "—",
      },
      {
        title: "預期一個隨機座位，並且預期當天才知道",
        body: "套裝保證的是等級，不是位置。NOL World 表示除了你所選的分類之外，區域與分區內的座位是隨機分配的——而你的座位會在演出當天於飯店領票時才顯示給你。你在開演前幾小時之前都不會知道自己坐在哪裡。它也堵住了顯而易見的追問：對座位不滿意不構成退款理由，而且取消手續費仍然可能照收。",
        pitfall:
          "照著座位位置做規劃——為了應援企劃要某一側、為了鏡頭要某一排。等級是承諾；其餘的是你當天才看到的抽籤。",
        takes: "—",
      },
      {
        title: "在飯店櫃台、本人親自、在指定時間內領取",
        body: "拿到這些票只有一種方式。NOL World 表示領票只能在飯店內的 NOL World 售票櫃台、只能在指定時段內，而且票只發給預約本人，必須由本人親自領取。被問到符合折扣資格的人能不能代為領取並代為入場時，它的回答是票只能由預約本人領取並使用，沒有例外。錯過指定時段，公開的答案就只是票僅在指定時間內提供。",
        pitfall:
          "把這一天的行程繞著場館安排。真正綁住你的約定在飯店櫃台，在別人訂下的一段時間裡，在演出當天。",
        takes: "把整天繞著它安排",
      },
      {
        title: "帶上櫃台實際會要求的文件",
        body: "NOL World 寫得很具體：預約本人有效的身分證件正本，加上列印或存在手機裡的預約確認——沒有這些就無法領票。非韓國籍人士可接受的證件是護照或外國人登錄證。韓國籍人士的清單較長，包括居民登錄證、駕照、護照、青少年證，或透過 Government 24 或 PASS 核發的行動身分證。",
        pitfall:
          "因為櫃台就在同一棟樓裡，就把護照留在房間保險箱。打開票的是身分證件正本，而它的照片不在那份清單上。",
        takes: "打包時 5 分鐘",
      },
      {
        title: "雙人套裝，兩個人都必須到櫃台",
        body: "這一條會打亂一整天的安排，而且很容易漏掉。NOL World 表示雙人套裝的預約本人與同行者都必須在場才能領票——而且同行者也必須出示身分證件，以確認他們符合入場的年齡條件。所以領票時段是一個需要兩個人、兩份證件的約定，不是其中一個人可以跑完的差事。",
        pitfall:
          "當天分頭行動——一個去領票，另一個去觀光或排周邊。櫃台不會只把票交給你們其中一個。",
        takes: "—",
      },
      {
        title: "現在就讓姓名與護照完全一致",
        body: "NOL World 用一句話同時回答了兩個後果：如果訂票時提供的姓名與你的護照不符，領票與飯店入住都將無法進行。套裝的兩半，被同一個錯誤同時擋住。它所回答的那個問題點名了常見的元凶——拼錯、漏掉中間名、大小寫、空格。請拿護照那一頁本身去對照訂單，不要憑記憶對照。",
        pitfall:
          "以為因為套裝已經付過錢了，一點小差異就會被放過。「已付款」不是那兩個櫃台在查的東西。",
        takes: "10 分鐘",
      },
      {
        title: "不要等飯店的確認信，因為沒有這種東西",
        body: "這會造成本來可以避免的恐慌，所以請事先知道。NOL World 表示飯店預約確認不會另外寄出，而且只要付款成功，飯店預約就是已確認且有效的。更有用的是：預約資料大約在住宿前兩週才會傳給飯店，所以在那之前飯店真的找不到你。如果你更早打去而他們從沒聽過你，那是被明文記錄的正常狀態。",
        pitfall:
          "因為六週前飯店說查不到預約，就另外訂一間備用房，或把套裝再買一次。本來什麼事都沒有，現在有兩筆訂單了。",
        takes: "2 分鐘的安心",
      },
      {
        title: "以購買者本人辦入住，並讀清楚那些小字的內容物",
        body: "飯店入住被綁在與票相同的那個人身上：NOL World 表示入住只有在驗證預約本人的身分之後才能進行，所以同行者無法先辦入住再等你。如果你會晚到，它的指示是事先聯絡飯店——同時警告這依飯店而定，可能無法通融。另外兩個值得在訂票前就知道的細節：未成年人沒有法定監護人不得住宿，而且除非你那個特定套裝含早餐，否則不含早餐。",
        pitfall:
          "派朋友先去放行李、先開始住。房間是靠你的身分打開的，不是靠訂單編號。",
        takes: "—",
      },
      {
        title: "如果有接駁車，請把它當成只有一班、沒有第二次機會",
        body: "在套裝含接駁車的情況下，NOL World 的回答毫不留情。使用它是選擇性的，而不使用退不回任何錢。沒有備援車輛，所以在上車地點遲到就等於車已經走了。只搭回程是可行的。沒有訂購的同行者可以問現場的接駁負責人，但座位有限且無法保證。還有那個會毀掉一個晚上的細節：你可以把行李箱帶上車，但抵達場館之後，車內不提供行李寄放。回程的上車地點與時間，會在飯店交票時一併給你。",
        pitfall:
          "因為巴士讓行李箱上車，就把行李箱帶去演唱會。到了場館沒有地方可以放，於是你會整場抱著它。",
        takes: "—",
      },
      {
        title: "在訂票之前讀取消的回答，因為答案是不行",
        body: "這一步要在這趟旅行還只是個計畫的時候就認真對待。NOL World 公開了兩個最棘手情況的答案，而兩個都是拒絕。關於感染：隨著 COVID-19 風險等級調降，隔離已不再是強制的，因此即使你被感染，取消手續費也不予減免。關於親屬過世與事故後住院：因個人事由不提供退款，取消手續費依各商品自身的政策收取。無論這讀起來是嚴苛還是僅僅清楚，它都告訴你風險坐在哪裡——從你付款的那一刻起，坐在你身上。為承擔它而設計的工具是在出發前投保的旅遊保險，而它實際保什麼取決於你買的那張保單，所以請讀那份文件，不要憑假設。",
        pitfall:
          "在沒有保險的情況下自己扛風險，賭一個足夠嚴重的理由會被接受。NOL World 已經公開了它對世上最嚴重的那兩個理由的答案。",
        takes: "30 分鐘，連同一份保單",
      },
    ],
    faq: [
      {
        q: "我可以買套裝但不使用飯店嗎？",
        a: "你可以選擇不住，但 NOL World 表示飯店部分不可退款，而且該筆預約不能轉讓給任何人。只使用比套裝所含更少的晚數並要求退回差額同樣被拒絕，因為晚數無法變更。",
      },
      {
        q: "我可以延長、縮短、改日期，或換飯店嗎？",
        a: "晚數無法變更，套裝中的入住與退房日期無法變更，而且不允許更換飯店。購買時也不能加晚數——NOL World 的指示是直接聯絡飯店詢問空房與價格，而且可能無法成立。升等房型也一樣：問飯店，並在抵達時直接付給飯店。",
      },
      {
        q: "我什麼時候會知道我的座位？",
        a: "在演出當天於飯店領票時。套裝保證的是等級；在那個等級之內，NOL World 隨機分配區域與座位。對結果不滿意不構成退款理由。",
      },
      {
        q: "可以請人代我領票，或代我入場嗎？",
        a: "不行。NOL World 表示票只發給預約本人且必須本人親自領取，而且票只能由預約本人領取並使用，沒有例外。雙人套裝的兩個人都必須在櫃台，而同行者也必須出示身分證件以供確認年齡。",
      },
      {
        q: "我沒有收到飯店的確認信。",
        a: "沒有這種信。NOL World 表示飯店確認不會另外寄出，而付款成功就意味著飯店預約已確認。它也表示預約資料大約在入住前兩週才會傳到飯店，所以直接向飯店確認要等到那之後才可能。",
      },
      {
        q: "我打給飯店，他們查不到我的訂房。",
        a: "如果你打得早，那是正常的。NOL World 表示資料大約在住宿前兩週才會送到飯店，確認也只有在那之後才可能，而一筆正確完成的套裝預約與付款就意味著飯店訂房是穩的。不要重新訂。",
      },
      {
        q: "我確診了，或是家裡有急事。取消手續費會被免除嗎？",
        a: "NOL World 公開的答案在兩種情況下都是不會。它表示隨著 COVID-19 隔離不再強制，即使你被感染，取消手續費也不予減免；而因個人事由，包括親屬過世或事故後住院，不提供退款，手續費依各商品的政策收取。在出發前購買的旅遊保險才是承擔這個風險的工具——它保什麼取決於保單，所以請讀它。",
      },
      {
        q: "我一定要搭接駁車嗎？可以帶行李箱上車嗎？",
        a: "搭不搭是選擇性的，而不搭退不回任何錢。行李箱可以帶上車，但 NOL World 警告抵達場館之後，車內不提供行李寄放——所以你帶上去的行李箱，就是你要自己扛的行李箱。如果你錯過發車，沒有備援車輛，而回程的上車地點與時間會在飯店交票時一併給出。",
      },
    ],
    labels: ZH_LABELS,
  },
  {
    locale: "id",
    slug: "nol-world-play-stay-package",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "NOL World Play&Stay: satu produk, dan nyaris tidak ada yang bisa diubah",
    summary:
      "Konser dan hotel dijual sebagai satu barang. Anda tidak bisa mengganti hotelnya, tanggalnya, atau jumlah malamnya; tidak menginap tidak mengembalikan apa pun; kursinya acak dan baru diumumkan pada hari-H; dan tiketnya diserahkan hanya kepada Anda sendiri, langsung, di hotel, di dalam satu jendela waktu.",
    scope:
      "Mencakup paket konser-plus-hotel Play and Stay dari NOL World sebagaimana NOL World mendokumentasikannya: apa yang terkunci, bagaimana tiket diambil, syarat identitas dan nama, dan apa yang sebenarnya dikatakan jawaban pembatalannya. Tiap paket membawa kebijakan pembatalan dan isinya sendiri, dan halaman produk yang berlaku. Layanan antar-jemput hanya dicatat di tempat sebuah paket menyertakannya.",
    intro: [
      "Sebuah paket terlihat seperti pilihan yang mudah: satu kali bayar, hotel dekat venue, kelas kursi yang dijamin, tidak perlu bertarung di antrean. Bagi fan dari luar negeri yang punya satu kesempatan untuk pergi, itu pertukaran yang sungguh menarik.",
      "Ia juga produk paling kaku di platform ini, dan kekakuannya tidak terlihat dari halaman produknya. Baca jawaban NOL World sendiri berderet dan sebuah pola muncul: paket ini adalah satu barang yang tidak terbagi. Bukan sebuah tiket dan sebuah kamar hotel yang bisa Anda optimalkan terpisah — satu benda, dibeli sekali, nyaris tidak bisa diubah di mana pun. Semua di bawah ini mengalir dari satu fakta itu, termasuk bagian-bagian yang akan terasa tidak adil ketika Anda membutuhkannya.",
    ],
    steps: [
      {
        title: "Pahami bahwa Anda membeli satu barang, bukan dua pemesanan",
        body: "Inilah seluruh panduan ini dalam satu langkah. NOL World menyatakan jumlah malam dalam sebuah paket tidak dapat diubah, tanggal check-in dan check-out yang ditentukan dalam paket tidak dapat diganti, dan penggantian hotel tidak diizinkan. Malam tambahan juga tidak bisa ditambahkan saat pembelian — menginap lebih lama adalah percakapan terpisah dengan hotelnya, dengan harga hotel dan tunduk pada ketersediaannya. Dan satu akun bisa membeli satu barang, jadi ini bukan sesuatu yang Anda tumpuk.",
        pitfall:
          "Memesan paketnya dengan niat merapikan detailnya nanti: datang sehari lebih awal, pindah ke hotel yang lebih dekat dengan teman, memangkas satu malam di akhir. Setiap satu dari itu adalah tidak yang terdokumentasi.",
        takes: "15 menit, sebelum Anda membayar",
      },
      {
        title: "Terima bahwa tidak menginap tidak mengembalikan apa pun",
        body: "Pertanyaannya ditanyakan dengan dua cara di FAQ NOL World dan mendapat jawaban yang sama dua-duanya: Anda boleh memilih untuk tidak menginap di hotelnya, tetapi refund untuk porsi hotel tidak tersedia, dan pemesanannya tidak dapat dialihkan kepada orang lain. Jadi menginap di tempat teman tidak berubah menjadi uang kembali, dan kamar yang Anda bayar tidak bisa diserahkan kepada siapa pun. Memakai satu malam lalu menuntut sisanya juga ditolak — jumlah malamnya terkunci.",
        pitfall:
          "Memperlakukan separuh hotelnya sebagai uang muka yang bisa Anda tinggalkan. Itu justru separuh yang tidak bisa Anda jual, berikan, atau tarik kembali.",
        takes: "—",
      },
      {
        title: "Harapkan kursi acak, dan harapkan mengetahuinya pada hari-H",
        body: "Paketnya menjamin kelas, bukan lokasi. NOL World menyatakan kursi di dalam seksi dan zona, di luar kategori yang Anda pilih, ditetapkan secara acak — dan bahwa penetapan kursi Anda ditampilkan ketika Anda mengambil tiket di hotel pada hari pertunjukan. Anda tidak akan tahu duduk di mana sampai beberapa jam sebelum konsernya. NOL World juga menutup pertanyaan lanjutan yang jelas: tidak puas dengan kursinya bukan alasan refund, dan biaya pembatalan tetap bisa berlaku.",
        pitfall:
          "Menyusun rencana di sekitar posisi kursi — sisi tertentu untuk sebuah proyek fan, satu baris untuk lensa. Kelasnya adalah janjinya; sisanya undian yang Anda lihat pada hari-H.",
        takes: "—",
      },
      {
        title: "Ambil di meja hotel, langsung, di dalam jendela waktunya",
        body: "Hanya ada satu cara mendapatkan tiket ini. NOL World menyatakan pengambilan hanya di meja tiket NOL World yang berada di dalam hotel, hanya selama jam yang ditentukan, dan bahwa tiket diterbitkan secara eksklusif kepada pemegang pemesanan, yang harus mengambilnya sendiri. Ditanya apakah orang yang berhak atas diskon bisa mengambil lalu menghadiri sebagai gantinya, jawabannya adalah tiket hanya bisa diambil dan dipakai oleh pemegang pemesanan, tanpa pengecualian. Lewatkan jam yang ditentukan dan jawaban yang diterbitkan hanyalah bahwa tiket tersedia hanya selama waktu yang ditetapkan.",
        pitfall:
          "Menyusun hari itu di sekitar venue. Janji yang mengikat ada di meja hotel, di dalam jendela waktu yang ditetapkan orang lain, pada hari konsernya.",
        takes: "Susun hari itu mengelilinginya",
      },
      {
        title: "Bawa dokumen yang memang diminta mejanya",
        body: "NOL World menyebutnya spesifik: identitas asli yang masih berlaku milik pemegang pemesanan, ditambah konfirmasi pemesanan baik dicetak maupun di ponsel — dan tanpa ini, tiket tidak bisa diambil. Untuk warga negara non-Korea, identitas yang diterima adalah paspor atau kartu registrasi orang asing. Warga negara Korea punya daftar yang lebih panjang, termasuk kartu registrasi penduduk, SIM, paspor, kartu identitas remaja, atau identitas seluler yang diterbitkan melalui Government 24 atau PASS.",
        pitfall:
          "Meninggalkan paspor di brankas kamar karena mejanya ada di gedung yang sama. Yang membuka tiketnya adalah identitas aslinya, dan fotonya tidak ada di daftar itu.",
        takes: "5 menit saat berkemas",
      },
      {
        title: "Untuk paket dua orang, kalian berdua harus ada di mejanya",
        body: "Yang satu ini menata ulang sebuah hari dan mudah terlewat. NOL World menyatakan bahwa untuk paket berdua, baik pemegang pemesanan maupun pendampingnya harus hadir untuk mengambil tiketnya — dan bahwa pendampingnya juga wajib menunjukkan identitas, untuk memastikan mereka memenuhi syarat usia masuk. Jadi jendela pengambilannya adalah janji untuk dua orang dengan dua identitas, bukan tugas yang bisa dijalankan salah satu dari kalian.",
        pitfall:
          "Berpencar pada hari itu — satu mengambil tiket sementara yang lain jalan-jalan atau antre merchandise. Mejanya tidak akan melepas tiketnya kepada salah satu dari kalian.",
        takes: "—",
      },
      {
        title: "Samakan namanya dengan paspor, persis, sekarang",
        body: "NOL World menjawabnya dengan kedua konsekuensinya dalam satu kalimat: jika nama yang diberikan saat memesan tidak cocok dengan paspor Anda, pengambilan tiket dan check-in hotel tidak akan bisa dilakukan. Kedua separuh paketnya, terhalang oleh kesalahan yang sama. Pertanyaan yang dijawabnya menyebut pelaku biasanya — salah eja, nama tengah yang hilang, huruf besar, spasi. Periksa pemesanannya terhadap halaman paspornya sendiri, bukan terhadap ingatan.",
        pitfall:
          "Mengira perbedaan kecil akan dilewatkan karena paketnya sudah dibayar. Sudah dibayar bukan hal yang sedang diperiksa di kedua meja itu.",
        takes: "10 menit",
      },
      {
        title: "Jangan menunggu surel konfirmasi hotel, karena tidak ada",
        body: "Ini menimbulkan kepanikan yang bisa dihindari, jadi ketahuilah sebelumnya. NOL World menyatakan konfirmasi pemesanan hotel tidak dikirim terpisah, dan bahwa jika pembayarannya berhasil, pemesanan hotelnya sudah terkonfirmasi dan sah. Yang lebih berguna: detail pemesanan baru diteruskan ke hotel kira-kira dua pekan sebelum menginap, jadi hotelnya memang tidak bisa menemukan Anda sebelum itu. Kalau Anda menelepon lebih awal dan mereka belum pernah mendengar nama Anda, itu keadaan normal yang terdokumentasi.",
        pitfall:
          "Memesan kamar cadangan, atau membeli paketnya lagi, karena hotelnya bilang tidak ada pemesanan enam pekan sebelumnya. Tidak ada yang salah, dan sekarang ada dua pemesanan.",
        takes: "2 menit untuk menenangkan diri",
      },
      {
        title: "Check-in sebagai pembelinya, dan baca isi paket yang kecil-kecil",
        body: "Check-in hotel bergantung pada orang yang sama dengan tiketnya: NOL World menyatakan check-in hanya tersedia setelah memverifikasi identitas pemegang pemesanan, jadi pendamping tidak bisa check-in lebih dulu lalu menunggu. Jika Anda akan tiba terlambat, instruksinya adalah menghubungi hotel sebelumnya — sambil memperingatkan itu bisa jadi tidak mungkin tergantung hotelnya. Dua hal lagi yang layak diketahui sebelum memesan: anak di bawah umur tidak bisa menginap tanpa wali yang sah, dan sarapan tidak termasuk kecuali paket Anda memang menyertakannya.",
        pitfall:
          "Mengirim teman lebih dulu untuk menaruh koper dan memulai menginapnya. Kamarnya terbuka atas identitas Anda, bukan atas nomor pemesanan.",
        takes: "—",
      },
      {
        title: "Kalau ada antar-jemput, perlakukan sebagai satu keberangkatan tanpa kesempatan kedua",
        body: "Di tempat sebuah paket menyertakan antar-jemput, jawaban NOL World tidak sentimental. Memakainya bersifat pilihan dan tidak memakainya tidak mengembalikan apa pun. Tidak ada kendaraan cadangan, jadi tiba terlambat di titik penjemputan berarti ia sudah berangkat. Antar-jemput hanya untuk kepulangan dimungkinkan. Pendamping yang tidak memesan bisa bertanya kepada petugas antar-jemput di lokasi, tetapi tempat duduknya terbatas dan tidak bisa dijamin. Dan detail yang merusak sebuah malam: Anda boleh membawa koper ke dalam bus, tetapi penyimpanan bagasi di dalam bus tidak tersedia begitu Anda tiba di venue. Titik dan waktu naik untuk kepulangan diberikan ketika tiketnya diserahkan di hotel.",
        pitfall:
          "Membawa koper ke konser karena busnya memperbolehkannya naik. Di venue tidak ada tempat menitipkannya, dan Anda menggendongnya sepanjang pertunjukan.",
        takes: "—",
      },
      {
        title: "Baca jawaban pembatalannya sebelum memesan, karena jawabannya tidak",
        body: "Inilah langkah yang harus ditanggapi serius selagi perjalanannya masih berupa rencana. NOL World menerbitkan jawaban untuk dua kasus tersulit dan keduanya penolakan. Soal infeksi: menyusul penurunan klasifikasi risiko COVID-19, karantina tidak lagi wajib, dan karenanya tidak ada pengurangan biaya pembatalan meski Anda terinfeksi. Soal kedukaan dan rawat inap setelah kecelakaan: refund untuk alasan pribadi tidak tersedia, dan biaya pembatalan berlaku menurut kebijakan masing-masing produk. Entah itu terbaca kejam atau sekadar jelas, ia memberi tahu Anda di mana risikonya duduk — pada Anda, sejak detik Anda membayar. Instrumen yang dirancang untuk memikulnya adalah asuransi perjalanan yang dibeli sebelum berangkat, dan apa yang sebenarnya ia tanggung bergantung pada polis yang Anda beli, jadi bacalah dokumen itu alih-alih mengiranya.",
        pitfall:
          "Memikul risikonya tanpa asuransi dengan asumsi alasan yang cukup serius akan diterima. NOL World sudah menerbitkan jawabannya untuk dua alasan paling serius yang ada.",
        takes: "30 menit dengan sebuah polis asuransi",
      },
    ],
    faq: [
      {
        q: "Bisakah saya membeli paketnya dan tidak memakai hotelnya?",
        a: "Anda boleh menolak menginap, tetapi NOL World menyatakan porsi hotelnya tidak bisa direfund dan pemesanannya tidak bisa dialihkan kepada siapa pun. Memakai malam lebih sedikit daripada yang ada di paket lalu menuntut selisihnya juga ditolak, karena jumlah malamnya tidak dapat diubah.",
      },
      {
        q: "Bisakah saya memperpanjang, memperpendek, menggeser tanggalnya, atau pindah hotel?",
        a: "Jumlah malam tidak dapat diubah, tanggal check-in dan check-out di dalam paket tidak dapat diganti, dan penggantian hotel tidak diizinkan. Malam tambahan juga tidak bisa ditambahkan saat pembelian — instruksi NOL World adalah menghubungi hotel langsung soal ketersediaan dan harga, dan itu bisa jadi tidak mungkin. Peningkatan kamar sama saja: tanyakan ke hotel, dan bayar langsung ke hotel saat tiba.",
      },
      {
        q: "Kapan saya tahu kursi saya?",
        a: "Ketika Anda mengambil tiketnya di hotel pada hari pertunjukan. Paketnya menjamin kelas; di dalam kelas itu, NOL World menetapkan seksi dan kursi secara acak. Tidak senang dengan hasilnya bukan alasan refund.",
      },
      {
        q: "Bisakah orang lain mengambilkan tiket saya, atau hadir menggantikan saya?",
        a: "Tidak. NOL World menyatakan tiket diterbitkan secara eksklusif kepada pemegang pemesanan dan harus diambil sendiri, dan bahwa tiket hanya bisa diambil dan dipakai oleh pemegang pemesanan, tanpa pengecualian. Untuk paket dua orang keduanya harus ada di mejanya, dan pendampingnya juga harus menunjukkan identitas agar usianya bisa dipastikan.",
      },
      {
        q: "Saya belum menerima surel konfirmasi hotel.",
        a: "Memang tidak ada. NOL World menyatakan konfirmasi hotel tidak dikirim terpisah, dan bahwa pembayaran yang berhasil berarti pemesanan hotelnya terkonfirmasi. NOL World juga menyatakan detail pemesanan baru sampai ke hotel sekitar dua pekan sebelum check-in, jadi konfirmasi langsung baru mungkin setelah itu.",
      },
      {
        q: "Saya menelepon hotelnya dan mereka tidak menemukan pemesanan saya.",
        a: "Wajar, kalau Anda menelepon lebih awal. NOL World menyatakan detailnya dikirim ke hotel kira-kira dua pekan sebelum menginap dan konfirmasi baru mungkin setelah itu, dan bahwa pemesanan paket serta pembayaran yang selesai dengan benar berarti pemesanan hotelnya aman. Jangan memesan ulang.",
      },
      {
        q: "Saya positif, atau ada keadaan darurat keluarga. Apakah biaya pembatalannya dihapus?",
        a: "Jawaban yang diterbitkan NOL World adalah tidak untuk kedua kasus. NOL World menyatakan bahwa dengan karantina COVID-19 tidak lagi wajib, tidak ada pengurangan biaya pembatalan meski Anda terinfeksi; dan bahwa refund untuk alasan pribadi, termasuk kedukaan atau rawat inap setelah kecelakaan, tidak tersedia, dengan biaya berlaku menurut kebijakan tiap produk. Asuransi perjalanan yang dibeli sebelum berangkat adalah mekanisme untuk risiko ini — apa yang ia tanggung bergantung pada polisnya, jadi bacalah.",
      },
      {
        q: "Apakah saya harus memakai antar-jemputnya, dan bolehkah saya membawa koper?",
        a: "Memakainya bersifat pilihan, dan tidak memakainya tidak mengembalikan apa pun. Koper boleh naik ke bus, tetapi NOL World memperingatkan bahwa penyimpanan bagasi di dalam bus tidak tersedia begitu Anda mencapai venue — jadi koper yang Anda bawa adalah koper yang Anda gendong. Tidak ada kendaraan cadangan jika Anda terlambat, dan titik serta waktu naik untuk kepulangan dibagikan bersama tiketnya di hotel.",
      },
    ],
    labels: ID_LABELS,
  },
  {
    locale: "zh-Hant",
    slug: "weverse-data-leak-what-to-do",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Weverse 個資外洩：究竟洩漏了什麼，以及它造成的那一個風險",
    summary:
      "422,584 個帳號，由 Weverse 自己確認。沒有姓名、沒有聯絡方式、沒有卡號——外洩的是一個內部識別碼和你的購買紀錄。那個組合不會把你的帳戶掏空；它是用來寫一封「知道你買了什麼」的訊息的原料。",
    scope:
      "涵蓋 Weverse Company 就其在 2026 年 9 月確認的外洩事件所公布的內容，英文版與韓文版的公告都讀過。我們不是資安稽核人員，本頁也不是法律建議：所有歸於 Weverse 的敘述都是它自己的說法，不是我們查證過的發現。資安事件可能有後續發展，而本頁帶著我們最後查核的日期。",
    intro: [
      "2026 年 9 月，Weverse Company 的代表公布了一則公告，確認顧客個人資料外洩。本站每一位讀者都有 Weverse 帳號，所以問題不是這件事重不重要，而是它實際改變了什麼——而答案比聳肩或恐慌都更窄、更具體。",
      "以下是對那則公告的細讀，兩種公布語言都讀了。有用的部分不是那個數字。有用的是：外洩的那一組特定資料，對偷你的錢幾乎毫無用處，對說服你卻異常好用。",
    ],
    steps: [
      {
        title: "讀那兩份清單，因為差別決定了一切",
        body: "Weverse 把外洩內容分成兩個標題逐項列出。屬於個人資料的：內部識別資訊——你註冊時為辨識使用者而產生的一組專屬內部編號。它歸類為非個人資料的一般資訊：購買類型即付款方式、金流服務商名稱、幣別、購買金額、取消金額、購買日期與時間、購買狀態，以及訂單被取消時的退款日期與時間。規模是以帳號 ID 為單位計算的 422,584 筆。重點在於兩份清單上都沒有的東西：沒有姓名、沒有聯絡方式、沒有卡號或付款憑證。",
        pitfall:
          "看到 422,584 這個數字，然後用對其他外洩事件的記憶把其餘的空格自己填上。憑證外洩的應對方式和這次的應對方式不同，所以那份逐項清單比標題更有價值。",
        takes: "5 分鐘",
      },
      {
        title: "公允地衡量 Weverse 的安撫說法，包括它的界限",
        body: "Weverse 表示，外洩的內部識別碼並非姓名或聯絡方式那種能直接辨識個人的資訊；它是只在 Weverse Company 內部系統中使用的值，無法在外部使用；而且僅憑這些資料項目，不太可能發生付款偽造或未經授權的資金移轉。就表面而言這個推論站得住腳——一個內部列編號不是身分，而這些欄位沒有一個是憑證。誠實的界限在於：一個內部識別碼，在它被接上另一個同樣含有它的資料集的那一刻就變得可辨識，而公司外部沒有人能衡量那有多大可能。那才是殘留的暴露：關聯，不是竊取。",
        pitfall:
          "把一個合理的安撫說法當成保證，或者把它當成公關話術。它是對特定欄位所做的特定主張，而它最有力的地方，恰好就是它最狹窄的地方。",
        takes: "5 分鐘",
      },
      {
        title: "理解真正的風險：一封知道你買了什麼的訊息",
        body: "把外洩的欄位放在一起看——付款方式、金流商、幣別、金額、日期、狀態、退款日期。那不是用來刷你的卡的裝備。那是用來寫一封訊息、並通過多數人對可疑郵件唯一會做的那個檢驗的裝備，而那個檢驗就是：寄件者知不知道一筆真實訂單的真實細節。一封引用你實際購買金額、在實際日期、以實際幣別、經由實際金流商的訊息，比任何隨機詐騙者所能寫出的東西都有說服力得多。",
        pitfall:
          "把「他們知道我的訂單細節」當成訊息為真的證明。在這次外洩之後，那個檢驗已經失效了，而那正是幾乎所有人都在用的檢驗。",
        takes: "5 分鐘",
      },
      {
        title: "知道為什麼這件事疊在一個真實的流程之上",
        body: "這對這群讀者比對多數人更重要，因為已經有正當的陌生人會向 Weverse 顧客要錢。Weverse Shop 提醒歐盟買家，他們可能會收到當地海關或物流業者另外寄來的付款指示，而不付款可能延誤或阻止送達。所以正當的經驗與詐騙的經驗現在長得一樣：一家你與之沒有關係的公司，引用一筆你確實下過的訂單，在你的包裹移動之前要你付一筆錢。外洩沒有製造出這個重疊，但它讓這個重疊更銳利了。",
        pitfall:
          "用「付錢了事」或「全部無視」來消解這份模糊。前者損失金錢，後者損失包裹。",
        takes: "—",
      },
      {
        title: "改用一種不依賴訊息知道什麼的檢驗方式",
        body: "出路是停止評估那封訊息，改為評估它所主張的事。把追蹤號碼或訂單編號從訊息裡抄出來，然後自己去物流業者或 Weverse Shop——自己輸入網址或用存好的書籤，絕不要點訊息裡的連結——看看那個編號對不對得上你的某筆訂單，以及是否真的有什麼款項未付。如果訊息是真的，同樣的資訊在另一邊也看得到。如果不是真的，那邊什麼都沒有，而你沒點任何東西就知道了。",
        pitfall:
          "因為細節都對就點了連結。細節都對，現在正是一封假訊息的預期狀態。",
        takes: "每封訊息 5 分鐘",
      },
      {
        title: "不要把改密碼當成解方",
        body: "任何外洩之後的反射動作都是改密碼，而在這裡它幾乎什麼都沒解決：暴露的是透過付款資訊 API 洩出的識別碼與購買中繼資料，不是登入憑證。換密碼不花成本也不造成傷害，所以如果它能讓你安心就去做——但做的時候要知道那是衛生習慣而不是補救，而真正保護你的是上一步那個查證習慣。開啟你的登入提供者所提供的任何雙因素選項都值得做，而那同樣不是對這次外洩的回應。",
        pitfall:
          "改了密碼，覺得事情辦完了，然後相信下一封引用你訂單的訊息。反射式的建議令人舒服，而它排擠掉了真正有效的建議。",
        takes: "10 分鐘",
      },
      {
        title: "從帳號本身查你是否受影響，不要從指南查",
        body: "Weverse 表示它依照相關法令所訂的標準，執行了一套獨立的程序，通知資料在這次外洩中的顧客。所以答案在你自己的帳號裡：帳號上登錄的電子郵件地址，以及你的 App 內通知。沒有任何指南能告訴你，包括這一份；而任何聲稱能幫你查詢是否在外洩名單中的第三方，都是該起疑的理由，而不是一項服務。",
        pitfall:
          "去搜尋一個能告訴你是否受影響的查詢工具。對一次內部識別碼的外洩而言，這種工具沒有任何有意義的東西可查，而那個搜尋動作本身，正是釣魚頁面在等的。",
        takes: "10 分鐘",
      },
      {
        title: "記下公司說它做了什麼，以及什麼還只是承諾",
        body: "Weverse 對自身應對的說法，用它的話：它強化了付款資訊處理 API 的存取控制，並將內部識別碼從中移除，使該資料不會對外暴露；於 9 月 4 日向韓國網際網路振興院（KISA）提交了資安事件通報；並通知了受影響的顧客。它所陳述的計畫包括：全面調查所有對外暴露的 API、收緊存取控制並將暴露資訊最小化、加強部署流程的控管，以及更敏銳的資安監控。它也表示已要求取得該資料的外部行為人歸還，並打算追究法律責任。請把兩類分開看：第一組是關於已完成工作的主張，外部沒有人能稽核；第二組是意向。",
        pitfall:
          "把一份計畫中的改善清單讀成一份已經到位的修復清單。公告並沒有那樣宣稱，對它的摘要也不該那樣宣稱。",
        takes: "5 分鐘",
      },
      {
        title: "按比例給予應有的評價",
        body: "Weverse 所描述的時間線很短：9 月 3 日在一名外部通報者揭露漏洞後接獲 KISA 聯繫，立即進行內部檢查與緊急應對，9 月 4 日向 KISA 提交外洩通報，以及一則以代表名義署名、逐項列出外洩內容的公開公告——包括那些它主張在法律上不屬於個人資料的欄位，而那些它本來不必列舉。我們把韓文原文對照英文讀過，兩者說的是同一件事，那本身就是一個小小的信號。這些都不能抵銷一次外洩。但一個只會把事件當醜聞來報導的網站，沒有教會讀者任何關於「稱職的處理長什麼樣」的事，而這一次比多數更接近它。",
        pitfall:
          "從一個冷靜的評估推論出「什麼都沒發生」。422,584 個帳號是一次真實的失誤，而即時揭露並不會把它取消掉。",
        takes: "—",
      },
      {
        title: "刪除帳號之前三思，並且知道刪除不是什麼",
        body: "刪除帳號是另一個反射動作，而它是一個比看起來更大的決定。Weverse Shop 與 NOL World 都把實際的東西綁在帳號上：訂單與預約紀錄、儲存的地址、已付費的會員資格，而在售票那一側還有已完成的身分驗證。不過決定性的那一點更簡單。刪除會從此之後把你的資料從服務中移除；它無法收回已經流出去的資料。這次外洩裡的任何東西，在你做任何決定之前就已經在裡面了，而事後關閉帳號觸及不到它。",
        pitfall:
          "把刪除帳號當成對外洩的回應。那是一個合理的念頭，而它不是這件事的補救；而且它會讓你失去一旦某筆購買出現爭議時你會需要的那份紀錄。",
        takes: "—",
      },
    ],
    faq: [
      {
        q: "我的姓名、地址或卡號外洩了嗎？",
        a: "依 Weverse 自己的逐項列舉是沒有。它所列出的是一組內部識別編號，加上購買中繼資料——付款方式、金流服務商名稱、幣別、購買與取消金額、購買日期與時間、購買狀態，以及退款日期與時間。姓名、聯絡方式與付款憑證不在清單上。",
      },
      {
        q: "我該換 Weverse 密碼嗎？",
        a: "換了不會有害，而它不是解方。暴露的是透過付款資訊 API 洩出的識別碼與購買中繼資料，而不是登入憑證，所以新密碼並不針對它。如果換了能讓你安心就換，然後把真正的力氣花在獨立查證付款要求上，那才是在這裡真正保護你的事。",
      },
      {
        q: "我怎麼知道自己是不是那 422,584 之一？",
        a: "透過你自己的帳號。Weverse 表示它依相關法令為受影響顧客執行了一套獨立的通知程序，所以請查看帳號登錄的電子郵件與 App 內通知。沒有任何外部工具能告訴你，而任何宣稱做得到的東西都該被當成釣魚攻擊。",
      },
      {
        q: "有人能用這些資料刷我的卡嗎？",
        a: "Weverse 表示僅憑這些項目不太可能發生付款偽造或未經授權的移轉，而就清單表面看這是合理的——外洩的欄位沒有一個是卡號或憑證。現實的風險不是一筆直接的扣款，而是一封有說服力的訊息，說服你自己去付一筆錢。",
      },
      {
        q: "如果它不是個人資料，那為什麼重要？",
        a: "因為「對攻擊者有沒有用」和「法律上怎麼歸類」是兩個不同的問題。購買金額、日期、付款方式與幣別，恰好正是讓一封詐騙訊息變得可信的東西——而人們判斷可疑郵件的慣常方式，就是看寄件者知不知道一筆真實訂單的真實細節。對這次外洩中的每一個人來說，那個檢驗不再有效了。",
      },
      {
        q: "我該刪掉 Weverse 帳號嗎？",
        a: "那是一個站得住腳的選擇，而它不是補救。刪除會停止未來的蒐集；它無法收回已經流出去的資料，包括這次外洩中的任何東西。它同時會讓你失去訂單與預約紀錄、儲存的地址、任何已付費的會員資格，而在售票那一側還有已完成的身分驗證——所以請依「你是否還想用這項服務」來決定，而不是把它當成對這件事的回應。",
      },
      {
        q: "Weverse 實際上做了什麼？",
        a: "依它自己的說法：強化了付款資訊 API 的存取控制並將內部識別碼從中移除、於 2026 年 9 月 4 日向 KISA 提交資安事件通報，並通知了受影響的顧客。它也列出計畫中的工作——稽核所有對外暴露的 API、收緊部署控管、提高監控敏感度——並表示已向涉事行為人要求歸還資料，且打算追究法律責任。已完成的項目是它的主張，而不是經稽核的發現。",
      },
      {
        q: "有比這更新的消息嗎？",
        a: "截至本頁上方的日期為止沒有，而那個日期是我們最後一次讀 Weverse Shop 公告列表的時間。資安事件可能有後續發展，所以那份列表才是最新版本——如果有後續公告，它會先出現在那裡，然後才會出現在這裡。",
      },
    ],
    labels: ZH_LABELS,
  },
  {
    locale: "id",
    slug: "weverse-data-leak-what-to-do",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Kebocoran data Weverse: apa yang benar-benar bocor, dan satu risiko yang ditimbulkannya",
    summary:
      "422,584 akun, dikonfirmasi Weverse sendiri. Tidak ada nama, tidak ada kontak, tidak ada nomor kartu — yang bocor adalah sebuah pengenal internal dan riwayat pembelian Anda. Kombinasi itu bukan akun yang dikuras; ia bahan mentah untuk sebuah pesan yang tahu apa yang Anda beli.",
    scope:
      "Mencakup apa yang Weverse Company terbitkan tentang kebocoran yang dikonfirmasinya pada September 2026, dibaca dalam versi Inggris maupun Korea dari pemberitahuannya. Kami bukan auditor keamanan dan ini bukan nasihat hukum: segala yang dikaitkan dengan Weverse adalah pernyataannya sendiri, bukan temuan yang kami verifikasi. Sebuah kasus keamanan bisa berkembang, dan halaman ini membawa tanggal terakhir kami memeriksanya.",
    intro: [
      "Pada September 2026 presiden Weverse Company menerbitkan pemberitahuan yang mengonfirmasi bahwa informasi pribadi pelanggan telah bocor. Setiap pembaca situs ini punya akun Weverse, jadi pertanyaannya bukan apakah ini penting melainkan apa yang sebenarnya berubah — dan jawabannya lebih sempit dan lebih spesifik daripada sekadar mengangkat bahu atau panik.",
      "Yang menyusul adalah pemberitahuan itu dibaca cermat, dalam kedua bahasa ia diterbitkan. Bagian yang berguna bukan angkanya. Bagian yang berguna adalah bahwa kombinasi data tertentu yang keluar nyaris tidak berguna untuk mencuri dari Anda dan luar biasa berguna untuk meyakinkan Anda.",
    ],
    steps: [
      {
        title: "Baca kedua daftarnya, karena selisihnya menentukan segalanya",
        body: "Weverse merinci apa yang bocor di bawah dua judul. Sebagai informasi pribadi: informasi identifikasi internal — sebuah nomor internal unik yang dibuat untuk identifikasi pengguna saat Anda mendaftar. Sebagai informasi umum yang ia golongkan bukan pribadi: jenis pembelian yaitu metode pembayaran, nama payment gateway, mata uang, jumlah pembelian, jumlah pembatalan, tanggal dan waktu pembelian, status pembelian, serta tanggal dan waktu refund jika sebuah pesanan dibatalkan. Skalanya 422,584 kasus yang dihitung dalam satuan ID akun. Yang tidak ada di kedua daftar itulah intinya: tidak ada nama, tidak ada kontak, tidak ada nomor kartu atau kredensial pembayaran.",
        pitfall:
          "Membaca 422,584 lalu mengisi sisanya dari ingatan tentang kebocoran lain. Respons terhadap kebocoran kredensial dan respons terhadap yang ini berbeda, jadi daftar rincinya lebih berharga daripada judulnya.",
        takes: "5 menit",
      },
      {
        title: "Timbang penenangan dari Weverse secara adil, termasuk batasnya",
        body: "Weverse menyatakan bahwa pengenal internal yang bocor bukan informasi yang langsung mengidentifikasi seseorang, seperti nama atau kontak; bahwa ia nilai yang dipakai hanya di dalam sistem internal Weverse Company dan tidak bisa dipakai dari luar; dan bahwa pemalsuan pembayaran atau transfer dana tanpa izin tidak mungkin terjadi hanya dari butir-butir data ini. Di permukaan penalaran itu bertahan — sebuah nomor baris internal bukan identitas, dan tak satu pun dari kolom ini berupa kredensial. Batas jujurnya adalah bahwa sebuah pengenal internal menjadi mengidentifikasi pada detik ia disambungkan ke kumpulan data lain yang juga memuatnya, dan tak seorang pun di luar perusahaan bisa mengukur seberapa mungkin itu. Itulah paparan yang tersisa: korelasi, bukan pencurian.",
        pitfall:
          "Memperlakukan penenangan yang masuk akal sebagai jaminan, atau memperlakukannya sebagai pencitraan. Ia klaim spesifik tentang kolom-kolom spesifik, dan ia paling kuat justru di tempat ia paling sempit.",
        takes: "5 menit",
      },
      {
        title: "Pahami risiko sebenarnya: sebuah pesan yang tahu apa yang Anda beli",
        body: "Lihat kolom-kolom yang bocor itu bersama-sama — metode pembayaran, gateway, mata uang, jumlah, tanggal, status, tanggal refund. Itu bukan perlengkapan untuk menagih kartu Anda. Itu perlengkapan untuk menulis sebuah pesan yang lolos satu-satunya uji yang kebanyakan orang terapkan pada surel mencurigakan, yaitu apakah pengirimnya tahu detail nyata tentang pesanan nyata. Sebuah pesan yang mengutip jumlah pembelian Anda yang sebenarnya, pada tanggal yang sebenarnya, dalam mata uang yang sebenarnya, lewat penyedia pembayaran yang sebenarnya, jauh lebih meyakinkan daripada apa pun yang bisa disusun penipu acak.",
        pitfall:
          "Memakai “mereka tahu detail pesanan saya” sebagai bukti bahwa sebuah pesan asli. Setelah kebocoran ini uji itu berhenti bekerja, dan itulah uji yang hampir semua orang pakai.",
        takes: "5 menit",
      },
      {
        title: "Ketahui kenapa ini mendarat di atas sebuah proses yang nyata",
        body: "Ini lebih penting bagi pembaca ini daripada bagi kebanyakan orang, karena orang asing yang sah memang sudah meminta uang kepada pelanggan Weverse. Weverse Shop memperingatkan pembeli Uni Eropa bahwa mereka bisa menerima instruksi pembayaran terpisah dari bea cukai setempat atau kurir, dan bahwa tidak membayar bisa menunda atau menghalangi pengiriman. Jadi pengalaman yang asli dan yang palsu kini terlihat sama: sebuah perusahaan yang tidak punya hubungan dengan Anda, menyebut pesanan yang benar-benar Anda buat, meminta pembayaran sebelum paket Anda bergerak. Kebocoran ini tidak menciptakan tumpang tindih itu, tetapi ia menajamkannya.",
        pitfall:
          "Menyelesaikan keraguan itu dengan membayar, atau dengan mengabaikan semuanya. Yang satu kehilangan uang dan yang lain kehilangan paket.",
        takes: "—",
      },
      {
        title: "Pakai pemeriksaan yang tidak bergantung pada apa yang pesan itu tahu",
        body: "Jalan keluarnya adalah berhenti menilai pesannya dan mulai menilai klaimnya. Ambil nomor pelacakan atau nomor pesanan dari dalamnya, lalu pergi sendiri ke kurirnya atau ke Weverse Shop — alamat yang Anda ketik sendiri atau penanda yang tersimpan, jangan pernah tautan di dalam pesannya — dan lihat apakah nomor itu cocok dengan salah satu pesanan Anda dan apakah ada yang benar-benar terutang. Jika pesannya asli, informasi yang sama ada di sisi sana. Jika tidak, tidak ada apa-apa, dan Anda mengetahuinya tanpa mengklik apa pun.",
        pitfall:
          "Mengikuti tautannya karena detailnya benar. Detail yang benar sekarang adalah keadaan yang diharapkan dari sebuah pesan palsu.",
        takes: "5 menit per pesan",
      },
      {
        title: "Jangan mengira penggantian kata sandi adalah solusinya",
        body: "Refleks setelah kebocoran apa pun adalah mengganti kata sandi, dan di sini itu nyaris tidak menyentuh apa pun: yang terpapar adalah sebuah pengenal dan metadata pembelian lewat API informasi pembayaran, bukan kredensial masuk. Mengganti kata sandi tidak memakan biaya dan tidak merugikan, jadi lakukan kalau itu menenangkan Anda — tetapi lakukan sambil tahu bahwa itu kebersihan dan bukan obat, dan bahwa yang sebenarnya melindungi Anda adalah kebiasaan verifikasi di langkah sebelumnya. Mengaktifkan opsi dua faktor apa pun yang ditawarkan penyedia login Anda layak dilakukan atas prinsip umum, dan itu juga bukan respons terhadap kebocoran ini.",
        pitfall:
          "Mengganti kata sandi, merasa selesai, lalu memercayai pesan berikutnya yang mengutip pesanan Anda. Nasihat refleks itu nyaman dan ia mendesak keluar nasihat yang bekerja.",
        takes: "10 menit",
      },
      {
        title: "Cari tahu apakah Anda terdampak, dari akunnya dan bukan dari sebuah panduan",
        body: "Weverse menyatakan ia menjalankan prosedur terpisah, sesuai kriteria yang ditetapkan hukum dan peraturan terkait, untuk memberi tahu pelanggan yang datanya ada dalam kebocoran itu. Jadi jawabannya ada di akun Anda sendiri: alamat surel yang terdaftar padanya, dan notifikasi di dalam aplikasi Anda. Tidak ada panduan yang bisa memberi tahu Anda, termasuk yang ini, dan pihak ketiga mana pun yang mengaku bisa memeriksa apakah Anda ada dalam kebocoran itu adalah alasan untuk curiga alih-alih sebuah layanan.",
        pitfall:
          "Mencari alat pencarian yang akan memberi tahu apakah Anda terdampak. Untuk kebocoran pengenal internal tidak ada yang bermakna untuk diperiksa alat semacam itu, dan pencarian itu sendirilah yang ditunggu sebuah halaman phishing.",
        takes: "10 menit",
      },
      {
        title: "Catat apa yang perusahaan bilang telah ia lakukan, dan apa yang masih berupa janji",
        body: "Keterangan Weverse tentang responsnya, dalam kata-katanya: ia memperkuat kontrol akses pada API pemrosesan informasi pembayaran dan menghapus pengenal internal darinya agar datanya tidak terpapar ke luar; pada 4 September ia mengajukan laporan insiden kebocoran kepada Korea Internet & Security Agency; dan ia memberi tahu pelanggan yang terdampak. Rencana yang ia nyatakan adalah investigasi penuh atas semua API yang terpapar ke luar, kontrol akses yang lebih ketat dan informasi terpapar yang diminimalkan, kontrol proses penerapan yang lebih ketat, dan pemantauan keamanan yang lebih peka. Ia juga menyatakan telah meminta pihak eksternal yang mengakses data itu untuk mengembalikannya, dan berniat menuntut pertanggungjawaban hukum. Pisahkan kedua kategorinya: kelompok pertama adalah klaim tentang pekerjaan yang sudah selesai yang tak seorang pun di luar bisa mengauditnya, dan yang kedua adalah niat.",
        pitfall:
          "Membaca daftar perbaikan yang direncanakan sebagai daftar perbaikan yang sudah terpasang. Pemberitahuannya tidak mengklaim itu, dan ringkasannya juga tidak seharusnya.",
        takes: "5 menit",
      },
      {
        title: "Berikan penilaian yang sepadan atas penanganannya",
        body: "Lini masa yang Weverse gambarkan pendek: dihubungi KISA pada 3 September setelah seorang pelapor eksternal mengungkap sebuah kerentanan, pemeriksaan internal dan respons darurat segera, laporan kebocoran diajukan ke KISA pada 4 September, dan sebuah pemberitahuan publik atas nama pimpinannya yang merinci apa yang keluar — termasuk kolom-kolom yang ia argumentasikan bukan informasi pribadi secara hukum, yang sebenarnya tidak harus ia sebutkan satu per satu. Kami membaca naskah Korea berdampingan dengan versi Inggrisnya dan keduanya mengatakan hal yang sama, yang merupakan sinyal kecilnya sendiri. Tak satu pun dari itu membatalkan sebuah kebocoran. Tetapi situs yang hanya pernah melaporkan insiden sebagai skandal tidak mengajari pembacanya apa pun tentang seperti apa penanganan yang cakap, dan yang ini lebih dekat ke sana daripada kebanyakan.",
        pitfall:
          "Menyimpulkan dari penilaian yang tenang bahwa tidak terjadi apa-apa. 422,584 akun adalah kegagalan nyata yang tidak dibatalkan oleh pengungkapan yang cepat.",
        takes: "—",
      },
      {
        title: "Pikir dua kali sebelum menghapus akun, dan ketahui penghapusan itu bukan apa",
        body: "Menghapus akun adalah refleks yang lain, dan ia keputusan yang lebih besar daripada kelihatannya. Weverse Shop dan NOL World sama-sama mengikat hal-hal nyata pada sebuah akun: riwayat pesanan dan pemesanan, alamat tersimpan, keanggotaan berbayar, dan di sisi tiket sebuah verifikasi identitas yang sudah selesai. Namun titik yang menentukan lebih sederhana. Penghapusan membuang data Anda dari layanan ke depan; ia tidak menarik kembali data yang sudah keluar. Apa pun yang ada dalam kebocoran ini sudah ada di dalamnya sebelum Anda memutuskan apa pun, dan menutup akun sesudahnya tidak bisa menjangkaunya.",
        pitfall:
          "Menghapus akun sebagai respons terhadap sebuah kebocoran. Itu hal yang wajar untuk diinginkan dan ia bukan obat untuk yang ini, dan ia memakan riwayat yang akan Anda butuhkan jika sebuah pembelian pernah disengketakan.",
        takes: "—",
      },
    ],
    faq: [
      {
        q: "Apakah nama, alamat, atau nomor kartu saya bocor?",
        a: "Tidak menurut rincian Weverse sendiri. Yang ia daftarkan adalah sebuah nomor identifikasi internal ditambah metadata pembelian — metode pembayaran, nama payment gateway, mata uang, jumlah pembelian dan pembatalan, tanggal dan waktu pembelian, status pembelian, serta tanggal dan waktu refund. Nama, kontak, dan kredensial pembayaran tidak ada di daftar itu.",
      },
      {
        q: "Haruskah saya mengganti kata sandi Weverse saya?",
        a: "Itu tidak akan merugikan, dan itu bukan solusinya. Yang terpapar adalah sebuah pengenal dan metadata pembelian lewat API informasi pembayaran alih-alih kredensial masuk, jadi kata sandi baru tidak menyentuhnya. Lakukan kalau itu menenangkan Anda, lalu habiskan usaha yang sebenarnya untuk memverifikasi permintaan pembayaran secara mandiri, karena itulah yang benar-benar melindungi Anda di sini.",
      },
      {
        q: "Bagaimana saya tahu apakah saya salah satu dari 422,584 itu?",
        a: "Lewat akun Anda sendiri. Weverse menyatakan ia menjalankan prosedur pemberitahuan terpisah untuk pelanggan terdampak menurut hukum yang berlaku, jadi periksa surel yang terdaftar pada akun itu dan notifikasi di dalam aplikasi Anda. Tidak ada alat eksternal yang bisa memberi tahu Anda, dan apa pun yang mengiklankan bahwa ia bisa sebaiknya diperlakukan sebagai percobaan phishing.",
      },
      {
        q: "Bisakah seseorang memakai ini untuk menagih kartu saya?",
        a: "Weverse menyatakan pemalsuan pembayaran atau transfer tanpa izin tidak mungkin hanya dari butir-butir ini, dan di permukaan daftarnya itu masuk akal — tak satu pun kolom yang bocor berupa nomor kartu atau kredensial. Risiko realistisnya bukan tagihan langsung melainkan sebuah pesan meyakinkan yang membujuk Anda melakukan pembayaran sendiri.",
      },
      {
        q: "Kalau itu bukan informasi pribadi, kenapa ia penting?",
        a: "Karena kegunaan bagi penyerang dan penggolongan hukum adalah dua pertanyaan berbeda. Jumlah pembelian, tanggal, metode pembayaran, dan mata uang persis itulah yang membuat sebuah pesan penipuan kredibel — dan cara biasa orang menilai surel mencurigakan adalah apakah pengirimnya tahu detail nyata tentang pesanan nyata. Uji itu tidak lagi bekerja bagi siapa pun dalam kebocoran ini.",
      },
      {
        q: "Haruskah saya menghapus akun Weverse saya?",
        a: "Itu pilihan yang bisa dipertahankan dan ia bukan obat. Penghapusan menghentikan pengumpulan di masa depan; ia tidak bisa menarik kembali data yang sudah keluar, termasuk apa pun dalam kebocoran ini. Ia juga memakan riwayat pesanan dan pemesanan, alamat tersimpan, keanggotaan berbayar apa pun, dan di sisi tiket sebuah verifikasi identitas yang sudah selesai — jadi putuskan berdasarkan apakah Anda masih menginginkan layanannya, bukan sebagai respons terhadap ini.",
      },
      {
        q: "Apa yang sebenarnya sudah Weverse lakukan?",
        a: "Menurut keterangannya sendiri: memperkuat kontrol akses pada API informasi pembayaran dan menghapus pengenal internal darinya, mengajukan laporan insiden kebocoran kepada KISA pada 4 September 2026, dan memberi tahu pelanggan yang terdampak. Ia juga mendaftar pekerjaan yang direncanakan — mengaudit semua API yang terpapar ke luar, memperketat kontrol penerapan, menaikkan kepekaan pemantauan — dan menyatakan telah meminta pengembalian data dari pihak yang terlibat serta berniat menuntut pertanggungjawaban hukum. Butir-butir yang sudah selesai adalah klaimnya, bukan temuan yang diaudit.",
      },
      {
        q: "Apakah ada yang lebih baru dari ini?",
        a: "Tidak per tanggal di bagian atas halaman ini, yaitu saat terakhir kami membaca daftar pemberitahuan Weverse Shop. Sebuah urusan keamanan bisa berkembang, jadi daftar itulah versi yang hidup — jika ada pemberitahuan lanjutan, ia akan ada di sana sebelum ada di sini.",
      },
    ],
    labels: ID_LABELS,
  },
  {
    locale: "zh-Hant",
    slug: "nol-facepass-face-registration",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "NOL facepass：誰握著你的臉，以及那是為了什麼",
    summary:
      "登錄一次，之後攝影機就讓你進場，不查票。臉是由 Toss 保管，不是 NOL World；登錄之後無法修改；而取消服務會刪除照片，但另外保留一份副本一年。",
    scope:
      "涵蓋 NOL World 就 NOL facepass 所公布的內容，包括它所述的取消後保留期間：它做什麼、臉部資料由誰儲存，以及登錄意味著你承諾了什麼。支援與否是逐場次的，由活動頁面決定。本頁沒有任何關於你所在國家生體資料法規的法律意見。",
    intro: [
      "韓國的場館正在轉向門口的人臉辨識，而海外粉絲遇到它的方式，是訂票過程中一個幾乎沒有英文說明的勾選框。那底下的問題並不小：一家你從未打過交道的公司，即將握有你的臉。",
      "NOL World 確實公布了答案。那些答案很具體，比多數公司做得到的更令人安心，而且值得在排隊之前讀，而不是在排隊當中讀——包括取消之後資料會怎樣的那一則，它所說的並不是「刪除」這兩個字單獨會讓人以為的意思。",
    ],
    steps: [
      {
        title: "搞清楚它取代了什麼",
        body: "NOL World 把 facepass 描述為縮短入場時身分驗證所需程序與時間的方法。臉部登錄完成之後，門口的攝影機會掃描你，你不經票券查驗就進場。它是門口證件查驗的替代品，不是疊在它上面的額外一層。",
        pitfall:
          "只把它讀成一項便利功能。NOL World 自己描述的後半段是管制，而那就是下一步。",
        takes: "2 分鐘",
      },
      {
        title: "知道它存在的另一個理由",
        body: "NOL World 把目的說了兩遍：簡化身分驗證，以及防止門票的非法販售與流通。一張必須與購票帳號相符的臉就是一道轉售管制，而它出現的時期，恰好與一部觸及高於票面價之慣常性轉售的修正版《公演法》重疊。這兩個事實該被放在一起看。",
        pitfall:
          "以為透過轉售平台買到的票在 facepass 閘口就能照樣通過。這套系統的存在，正是為了讓那件事行不通。",
        takes: "2 分鐘",
      },
      {
        title: "知道那張臉實際上去了哪裡",
        body: "這是最值得知道的部分。NOL World 表示臉部資訊——原始影像與特徵資料——是加密後由 Toss 儲存的，也就是 FaceAccess 服務背後的那家金融科技公司，而且在任何情況下都不會提供給 NOL World 或主辦單位。只有驗證結果，成功或失敗，會被分享。NOL World 也表示該資料不會被用於提供服務以外的任何目的，並引述 Toss 持有 ISO 27701 與 CBPR 認證。",
        pitfall:
          "這些是 NOL World 對一家第三方公司所做的陳述，不是一份稽核報告。以這類頁面而言它們具體得不尋常，那是認真看待它們的理由，不是停止閱讀的理由。",
        takes: "5 分鐘",
      },
      {
        title: "把登錄當成永久的",
        body: "臉一旦登錄就無法修改。NOL World 直白地給出理由——那是為了防止該服務被不正當使用。之後沒有辦法更正一次糟糕的登錄，所以你登錄時的條件就是你會一直保有的條件：光線、眼鏡，攝影機當時拍到的一切。",
        pitfall:
          "在排隊中匆匆登錄，在糟糕的光線下，打算之後再好好重做一次。沒有之後。",
        takes: "10 分鐘，慎重地",
      },
      {
        title: "絕不要讓任何人在你的手機或帳號上登錄",
        body: "NOL World 說得很直接：請確保沒有其他人使用你的帳號，而如果有人用你的手機或帳號登錄了臉部資訊，該公司對由此產生的任何問題不負責任。一台家人共用的裝置，在巡迴開賣的那一刻，正是這種事發生的方式，而承擔後果的是那個帳號。",
        pitfall:
          "在你已登入的手機上幫朋友登錄。現在附在你帳號上的那張臉是他們的，它無法修改，而免責聲明寫得很明白。",
        takes: "1 分鐘",
      },
      {
        title: "確認你那一場究竟支不支援",
        body: "支援與否是逐場次而非全面的——NOL World 專門維護了一則「如何確認某場演出是否支援 facepass」的問答，而那則問答之所以存在，正是因為答案會變。在你把入場計畫押在它上面之前，請先看你那一場的活動頁面，並把一般路線準備好：確認編號與售票口的身分證件。",
        pitfall:
          "登錄完了，然後抵達一個仍在做證件查驗的場館，而護照留在飯店。",
        takes: "3 分鐘",
      },
      {
        title: "仔細讀刪除那一則答案——它不只是刪除",
        body: "NOL World 回答了「取消訂閱後臉部資訊是否會被刪除」，而那個答案有兩半。第一半：你的臉部照片會在你取消服務時被刪除，而要再次使用就得重新登錄。第二半：為了身分驗證的目的，該資料會被另外儲存並自取消時點起保留一年——NOL World 表示那只用於重新登錄時的身分驗證，並在那一年之後銷毀。所以取消訂閱是刪除照片並啟動一個計時器，而不是停止一個。那是一項站得住腳的政策，而它不是「刪除」這兩個字單獨會讓人以為的意思，這正是為什麼值得在登錄之前用他們自己的措辭讀一遍。",
        pitfall:
          "接受任何第三方對生體資料處理方式的一句話摘要，包括我們的。請讀那句關於保留期間的話，不要讀標題。",
        takes: "5 分鐘",
      },
    ],
    faq: [
      {
        q: "NOL World 看得到我的臉嗎？",
        a: "NOL World 表示看不到。臉部資訊是加密後由 Toss 保管的，而 NOL World 表示在任何情況下都不會提供給 NOL World 或主辦單位——只有驗證的成功或失敗會被分享。",
      },
      {
        q: "如果第一次登錄效果不好，我可以重新登錄嗎？",
        a: "不行。NOL World 表示已登錄的臉無法修改，以防止該服務被不正當使用。請在第一次就慎重地登錄。",
      },
      {
        q: "如果我取消 facepass，我的臉部資料會被刪除嗎？",
        a: "一部分會，然後進入一個計時器。NOL World 表示取消訂閱時臉部照片會被刪除，而你若要再使用該服務就必須重新登錄。它也表示為了身分驗證的目的，該資料會被另外儲存並自取消起保留一年，僅在你重新登錄時用於身分驗證，並在那一年之後銷毀。在 2026 年 10 月 20 日之前，本頁曾表示我們尚未讀到那則答案並拒絕為它做摘要；現在它已引述於上，並記錄在我們的更正紀錄中。",
      },
      {
        q: "每一場演唱會都用 facepass 嗎？",
        a: "不是。支援情況依場次而異，而 NOL World 另外維護了一則關於如何確認的答案。請在你那一場的活動頁面上確認，並保留一般的領票路線可用。",
      },
      {
        q: "如果別人在我的帳號上登錄了他們的臉，會怎樣？",
        a: "NOL World 表示該公司對由此產生的問題不負責任，並要求你確保沒有其他人使用你的帳號。由於已登錄的臉無法變更，這件事無法用一般方式挽回。",
      },
    ],
    labels: ZH_LABELS,
  },
  {
    locale: "id",
    slug: "nol-facepass-face-registration",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "NOL facepass: siapa yang memegang wajah Anda, dan untuk apa",
    summary:
      "Daftar sekali dan sebuah kamera mempersilakan Anda masuk tanpa pemeriksaan tiket. Wajahnya disimpan oleh Toss, bukan oleh NOL World, ia tidak bisa diubah sesudahnya, dan membatalkan layanannya menghapus fotonya tetapi menyimpan salinan terpisah selama satu tahun.",
    scope:
      "Mencakup apa yang NOL World terbitkan tentang NOL facepass, termasuk masa penyimpanan setelah pembatalan sebagaimana ia nyatakan: apa yang ia lakukan, siapa yang menyimpan data wajahnya, dan apa yang Anda ikat dengan mendaftar. Dukungannya ditetapkan per konser, dan halaman acaranya yang menentukan. Tidak ada di sini yang merupakan pendapat hukum tentang data biometrik di negara Anda sendiri.",
    intro: [
      "Venue-venue Korea sedang beralih ke pengenalan wajah di pintu masuk, dan seorang fan dari luar negeri menemuinya sebagai sebuah kotak centang saat memesan dengan penjelasan berbahasa Inggris yang sangat sedikit. Pertanyaan di baliknya tidak kecil: sebuah perusahaan yang belum pernah berurusan dengan Anda sebentar lagi akan memegang wajah Anda.",
      "NOL World memang menerbitkan jawaban. Jawabannya spesifik, lebih menenangkan daripada yang berhasil dilakukan kebanyakan perusahaan, dan layak dibaca sebelum antrean alih-alih di tengahnya — termasuk yang tentang apa yang terjadi pada datanya setelah Anda membatalkan, yang tidak mengatakan apa yang disiratkan satu kata seperti dihapus.",
    ],
    steps: [
      {
        title: "Pahami apa yang ia gantikan",
        body: "NOL World menggambarkan facepass sebagai cara memangkas prosedur dan waktu yang dibutuhkan verifikasi identitas saat masuk. Begitu pendaftaran wajah selesai, sebuah kamera memindai Anda di pintu dan Anda masuk tanpa verifikasi tiket. Ia pengganti pemeriksaan dokumen di gerbang, bukan lapisan tambahan di atasnya.",
        pitfall:
          "Membacanya sebagai fitur kenyamanan saja. Paruh kedua dari deskripsi NOL World sendiri adalah penegakan, dan itulah langkah berikutnya.",
        takes: "2 menit",
      },
      {
        title: "Ketahui alasan lain keberadaannya",
        body: "NOL World menyatakan tujuannya dua kali: menyederhanakan verifikasi identitas, dan mencegah penjualan serta peredaran tiket secara ilegal. Sebuah wajah yang harus cocok dengan akun yang membeli tiketnya adalah kendali penjualan ulang, dan ia tiba pada periode yang sama dengan revisi Undang-Undang Pertunjukan yang menjangkau penjualan ulang kebiasaan di atas harga tiket. Kedua fakta itu layak diletakkan berdampingan.",
        pitfall:
          "Mengira tiket yang dibeli lewat lokapasar penjualan ulang akan begitu saja berfungsi di gerbang facepass. Sistem itu ada justru agar hal itu tidak berfungsi.",
        takes: "2 menit",
      },
      {
        title: "Ketahui ke mana wajah itu sebenarnya pergi",
        body: "Inilah bagian yang paling layak diketahui. NOL World menyatakan informasi wajah — citra aslinya dan data fiturnya — dienkripsi dan disimpan oleh Toss, perusahaan fintech di balik layanan FaceAccess, dan bahwa ia tidak diberikan kepada NOL World maupun kepada penyelenggara dalam keadaan apa pun. Hanya hasil autentikasinya, berhasil atau gagal, yang dibagikan. NOL World juga menyatakan datanya tidak dipakai untuk tujuan apa pun di luar penyediaan layanannya, dan menyebut Toss memegang sertifikasi ISO 27701 dan CBPR.",
        pitfall:
          "Ini pernyataan NOL World tentang pihak ketiga, bukan sebuah audit. Pernyataannya luar biasa spesifik untuk halaman semacam ini, yang merupakan alasan untuk menanggapinya serius dan bukan alasan untuk berhenti membaca.",
        takes: "5 menit",
      },
      {
        title: "Perlakukan pendaftaran sebagai permanen",
        body: "Begitu sebuah wajah terdaftar ia tidak bisa diubah. NOL World memberi alasannya terang-terangan — itu untuk mencegah penggunaan layanannya secara tidak sah. Tidak ada memperbaiki pendaftaran yang buruk di kemudian hari, jadi kondisi saat Anda mendaftar adalah kondisi yang Anda simpan: pencahayaannya, kacamatanya, apa pun yang ditangkap kameranya.",
        pitfall:
          "Mendaftar terburu-buru di tengah antrean, di bawah cahaya yang buruk, dengan niat mengulanginya dengan benar nanti. Tidak ada nanti.",
        takes: "10 menit, dengan sengaja",
      },
      {
        title: "Jangan pernah biarkan siapa pun mendaftar di ponsel atau akun Anda",
        body: "NOL World mengatakannya langsung: pastikan tidak ada orang lain yang memakai akun Anda, dan jika seseorang mendaftarkan informasi wajah memakai ponsel atau akun Anda, perusahaan tidak bertanggung jawab atas masalah apa pun yang timbul. Sebuah perangkat rumah tangga yang dipakai bersama, pada detik sebuah tur dibuka, persis begitulah hal ini terjadi, dan akunlah yang memikul akibatnya.",
        pitfall:
          "Membantu teman mendaftar di ponsel Anda yang sedang masuk ke akun. Wajah yang kini melekat pada akun Anda adalah wajah mereka, ia tidak bisa diubah, dan penafian itu tertulis jelas.",
        takes: "1 menit",
      },
      {
        title: "Periksa apakah konser Anda mendukungnya sama sekali",
        body: "Dukungannya per acara alih-alih menyeluruh — NOL World memelihara satu pertanyaan khusus tentang cara memeriksa apakah sebuah konser mendukung facepass, dan pertanyaan itu hanya ada karena jawabannya berbeda-beda. Periksa halaman acara konser Anda sebelum menyusun rencana masuk di atasnya, dan siapkan rute biasanya: nomor konfirmasi dan identitas di loket.",
        pitfall:
          "Mendaftar, lalu tiba di venue yang masih melakukan pemeriksaan dokumen, dengan paspor tertinggal di hotel.",
        takes: "3 menit",
      },
      {
        title: "Baca jawaban soal penghapusan dengan cermat — ia bukan sekadar penghapusan",
        body: "NOL World menjawab apakah informasi wajah dihapus jika Anda berhenti berlangganan, dan jawabannya punya dua paruh. Yang pertama: foto wajah Anda dihapus ketika Anda membatalkan layanannya, dan memakainya lagi berarti mendaftar lagi. Yang kedua: untuk keperluan verifikasi identitas, datanya disimpan terpisah dan ditahan selama satu tahun sejak titik pembatalan — dipakai, kata NOL World, hanya untuk verifikasi identitas saat pendaftaran ulang, dan dibuang setelah tahun itu. Jadi berhenti berlangganan menghapus fotonya dan memulai sebuah hitungan mundur alih-alih menghentikannya. Itu kebijakan yang bisa dipertahankan dan ia bukan apa yang disiratkan kata dihapus sendirian, dan karena itulah ia layak dibaca dalam kata-kata mereka sebelum Anda mendaftar.",
        pitfall:
          "Menerima ringkasan satu kata dari pihak ketiga mana pun tentang apa yang terjadi pada data biometrik, termasuk ringkasan kami. Baca kalimat tentang masa penyimpanannya, bukan judulnya.",
        takes: "5 menit",
      },
    ],
    faq: [
      {
        q: "Apakah NOL World melihat wajah saya?",
        a: "NOL World menyatakan tidak. Informasi wajah dienkripsi dan dipegang oleh Toss, dan NOL World menyatakan ia tidak diberikan kepada NOL World maupun penyelenggara dalam keadaan apa pun — hanya berhasil atau gagalnya autentikasi yang dibagikan.",
      },
      {
        q: "Bisakah saya mendaftarkan ulang wajah saya kalau percobaan pertama buruk?",
        a: "Tidak. NOL World menyatakan wajah yang sudah terdaftar tidak bisa diubah, untuk mencegah penggunaan layanannya secara tidak sah. Daftarlah dengan sengaja pada kali pertama.",
      },
      {
        q: "Apakah data wajah saya dihapus kalau saya membatalkan facepass?",
        a: "Sebagian, lalu masuk hitungan mundur. NOL World menyatakan foto wajahnya dihapus ketika Anda berhenti berlangganan, dan bahwa Anda harus mendaftar lagi untuk memakai layanannya. NOL World juga menyatakan bahwa untuk keperluan verifikasi identitas datanya disimpan terpisah dan ditahan selama satu tahun sejak pembatalan, dipakai hanya untuk verifikasi identitas jika Anda mendaftar ulang, dan dibuang setelah tahun itu. Sampai 20 Oktober 2026 halaman ini menyatakan kami belum membaca jawaban itu dan menolak meringkasnya; kini ia dikutip di atas dan dicatat dalam daftar koreksi kami.",
      },
      {
        q: "Apakah setiap konser memakai facepass?",
        a: "Tidak. Dukungannya berbeda menurut acara, dan NOL World menyimpan jawaban terpisah tentang cara memeriksanya. Pastikan di halaman acara konser Anda, dan jaga agar rute pengambilan biasa tetap tersedia.",
      },
      {
        q: "Apa yang terjadi kalau orang lain mendaftarkan wajahnya di akun saya?",
        a: "NOL World menyatakan perusahaan tidak bertanggung jawab atas masalah yang timbul dari itu, dan meminta Anda memastikan tidak ada orang lain yang memakai akun Anda. Karena wajah yang sudah terdaftar tidak bisa diubah, ini tidak bisa dipulihkan dengan cara biasa.",
      },
    ],
    labels: ID_LABELS,
  },
  {
    locale: "zh-Hant",
    slug: "nol-world-booking-fees-and-checkout-clock",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "NOL World 結帳：預訂手續費、那個時鐘，以及你用哪種幣別付款",
    summary:
      "一張演唱會門票帶著 8,000 韓元的服務手續費，你有十分鐘選座位、七分鐘付款，而付款視窗會要你選一種幣別。三個跟錢有關的決定和一個計時器，全都是公開的，而且沒有一個是顯而易見的。",
    scope:
      "涵蓋 NOL World 就其結帳的費用與時間所公布的內容：依類型區分的服務手續費、兩段式購買計時器、幣別選擇、優惠券，以及每筆訂單的上限。手續費與計時器都可能逐場次設定，而 NOL World 兩者都這麼說了，所以你那一場的活動頁面效力更高。本頁沒有任何關於哪一種幣別對你那張特定卡片比較便宜的建議。",
    intro: [
      "韓國結帳頁面上出錯的多數情況都不是卡片的問題。而是那個頁面正在問三個附帶金錢的問題，同時有一個計時器在走，而一位海外買家第一次遇到這一切時，大約只剩七分鐘。",
      "這些全都是公開的，而且沒有一項出現在你判斷「這張票買得起」的那個商品頁上。所以本頁的目的，是把那些意外搬到前一週。",
    ],
    steps: [
      {
        title: "在你判斷這張票買得起之前，先把服務手續費加上去",
        body: "NOL World 依類型公布其服務手續費。音樂劇與演唱會是 8,000 韓元——不含線上演唱會與後援會會員資格等特定商品。其他演出與體育賽事是 3,000 韓元。休閒與展覽免費。NOL World 也表示手續費可能依商品而異，請在購買時確認，所以請把這些當成公布的基準線，而不是對你那一場的承諾。",
        pitfall:
          "拿韓國票價跟你本地的票價比較，卻忘了這一筆是疊在上面的。它金額不大，而它正是那種會在最糟的時刻讓整個平台顯得不可信的小意外。",
        takes: "2 分鐘",
      },
      {
        title: "知道這筆手續費實際上買到什麼，因為其中一行很重要",
        body: "NOL World 逐項列出服務手續費涵蓋什麼：網站維護與相關成本、支援其詐欺偵測系統的支付處理、防止機器人與巨集相關之不正當訂票的技術費用，以及全球預約的系統支援。第三項才是有意思的那一項。這筆費用有一部分在資助反巨集的機制，而那與身分查驗、與修正版《公演法》是同一個管制方向——這也是為什麼那個排隊系統表現得像一個對抗性系統，而不是一條隊伍。",
        pitfall:
          "把手續費讀成純粹的利潤，把排隊讀成無能。平台正在告訴你它把這筆費用花在把自動化買家擋在外面，而那也正是它對你施加的規則如此嚴格的原因。",
        takes: "2 分鐘",
      },
      {
        title: "搞懂那個時鐘：十分鐘選位，七分鐘付款",
        body: "購買計時器分兩段，NOL World 兩段都說明了。從進入訂票頁面起，你最多有十分鐘選座位。一旦你進到價格步驟，你的座位會被保留七分鐘供你完成付款，頁面上方有一個計時器。錯過它，座位就會自動被釋出，而你要從頭再訂一次。不指定座位或自由入座的訂票，在付款前同樣有十分鐘的上限。NOL World 補充說上限可能依活動而異，而有些活動沒有上限。",
        pitfall:
          "在那七分鐘之內才打開銀行 App 去找卡號。卡片資料、帳單地址與你銀行的核准 App，都應該在你進入訂票頁面之前就準備好，因為那個時鐘不在乎你的手機正要你重新登入一次。",
        takes: "17 分鐘，如果你全部用完",
      },
      {
        title: "把幣別那個問題當成一個真正的決定",
        body: "NOL World 支援以 24 種幣別付款，包括韓元、美元、日圓與人民幣，而可選的幣別會在你輸入卡片資料之後出現。它提供的選擇，是在你卡片發卡國的幣別與韓元之間。那是由兩個不同的對象所訂的兩種不同匯率——一個由在付款頁面做換算的那一方訂，一個由你的卡組織與發卡機構訂。選擇你自己的幣別就是動態貨幣轉換，而做換算的那一方會訂匯率並從中抽取一層價差，所以以韓元付款通常是兩者中比較便宜的。通常，但不是總是：你自己卡片的國外交易手續費不管選哪一種都會收，而發卡機構的差勁匯差也可能把差距抹平。你真正能在當天之前查清楚的那一半，是你發卡機構的條款，所以去查它。",
        pitfall:
          "因為數字看起來熟悉就選自己的本國幣別。在這裡，熟悉的那個選項比較貴的機率更高，而這是唯一一個由你決定「誰來做換算」的畫面。",
        takes: "10 分鐘，事先跟你的銀行",
      },
      {
        title: "在付款之前套用優惠券，因為沒有之後",
        body: "NOL World 對這一點很直接：付款一旦完成，你就無法再套用優惠券。它提供的唯一路線，是取消同一個座位並在套用優惠券的情況下重訂——而它警告取消與重訂可能依該活動自身的費用政策產生手續費，所以請先確認那些。請誠實地把那個成本與優惠券的價值相比，並且記得你釋出的那個座位在你重訂期間並不會為你保留。",
        pitfall:
          "為了省下一筆你未必用得到的折扣，去取消一個你實際上已經拿到的座位。優惠券的價值低於門票，而庫存不會等人。",
        takes: "5 分鐘",
      },
      {
        title: "預期會有張數上限，而且預期那是主辦單位訂的",
        body: "NOL World 表示依主辦單位而定，同一場演出可能對每筆訂單或每位會員可預約的張數設有上限——而在演唱會門票與旅遊或其他入場券合併販售的情況下，主辦單位也可能另外施加每位會員的上限。所以那個上限不是一個你可以查到的全平台數字；它是逐場次設定的，有時是按人而不是按交易計算，而它是一筆團體訂單可能在最後一步失敗的原因。",
        pitfall:
          "照著你在另一場演出讀到的上限去規劃四人訂單。每位會員的上限也不能靠把訂單拆到你自己的多個帳號來解決——那個模式就在 NOL World 公布的不正當使用清單上。",
        takes: "5 分鐘",
      },
      {
        title: "在會顯示狀態的地方確認訂單確實存在",
        body: "付款之後，打開 NOL World 網站或 App，前往 Account/My，然後 My Reservations。NOL World 表示基本的預約明細與狀態在列表與預約詳細頁上都看得到。請趁你還坐在電腦前時做一次，而不是假設確認信就是全部的事實——預約列表才是一個「不如你預期的狀態」會現形的地方，而那也是你聯絡客服時會被問到的畫面。",
        pitfall:
          "把一筆成功的付款當成一筆存在的訂單。它們通常是同一件事，而去確認的全部意義，就在於它們不是的那一次。",
        takes: "2 分鐘",
      },
      {
        title: "知道對你買的東西而言「完成」是什麼意思",
        body: "對表演藝術與演唱會，NOL World 表示流程在付款時即告完成，而你在場館售票口領票。旅遊與體驗類商品則不一致：有些會發一個 QR 或條碼到你的 My Page 或電子郵件，可直接入場；有些則要求你在現場櫃台出示憑證或預約確認，換成實體票之後才能入場。NOL World 的指示是去商品頁確認適用哪一種，因為這個差別決定了你是否需要在入口之前先找到一個櫃台。",
        pitfall:
          "以為電子郵件裡的 QR 碼就是入場券。對換票型商品而言，那是你拿去櫃台交換的東西，而櫃台有營業時間。",
        takes: "5 分鐘",
      },
    ],
    faq: [
      {
        q: "演唱會門票的預訂手續費是多少？",
        a: "NOL World 公布音樂劇與演唱會為 8,000 韓元，不含線上演唱會與後援會會員資格等特定商品；其他演出與體育賽事為 3,000 韓元；休閒與展覽則不收。它也表示手續費可能依商品而異並請在購買時確認，所以請在你自己那一場上確認。",
      },
      {
        q: "結帳時我實際上有多少時間？",
        a: "從進入訂票頁面起有十分鐘選座位，接著是你付款期間的七分鐘保留，頁面上方會顯示計時器。超過就會釋出座位而你得重來。自由入座同樣有那十分鐘。NOL World 表示上限可能依活動而異，而有些活動沒有上限。",
      },
      {
        q: "我該用韓元還是自己的幣別付款？",
        a: "通常是韓元。NOL World 支援 24 種幣別，並讓你在卡片發卡國幣別與韓元之間選擇，選項在你輸入卡片資料之後出現。選擇你自己的幣別就是動態貨幣轉換，由做換算的那一方訂匯率並加上一層差額——所以韓元一般比較便宜。你卡片自己的國外交易手續費不管選哪一種都會收，而那正是該在當天之前跟發卡機構確認的部分。",
      },
      {
        q: "我忘了用優惠券。現在可以加上去嗎？",
        a: "不行。NOL World 表示付款完成之後就無法再套用優惠券。它給出的唯一路線是取消同一個座位並套用優惠券重訂，而它警告取消與重訂可能依該活動的政策產生手續費。在你釋出一個已經握在手上的座位之前，請先確認那筆費用。",
      },
      {
        q: "為什麼我只能訂兩張，而我朋友訂了四張？",
        a: "因為那個上限屬於主辦單位，不屬於平台。NOL World 表示一場演出可能對每筆訂單或每位會員限制張數，而演唱會加旅遊的合併商品也可能另有每位會員的上限。不同的演出，或不同的販售輪次，上限可以不一樣。",
      },
      {
        q: "我可以在 NOL World 使用韓國信用卡嗎？",
        a: "不行。NOL World 只接受在韓國境外發行的卡片；韓國發行的卡片屬於韓文站上已驗證的國內會員。一張韓國卡在這裡被拒，是規則正在運作，不是故障。",
      },
      {
        q: "我要去哪裡確認我的訂單有沒有成立？",
        a: "NOL World 的網站或 App，在 Account/My 之下的 My Reservations。NOL World 表示預約明細與狀態在列表與詳細頁上都會出現。顯示狀態的是那個畫面，而不是確認信。",
      },
      {
        q: "我已經付款了。演出之前還有事要做嗎？",
        a: "如果是演唱會或表演藝術的門票，沒有——NOL World 表示流程已完成，你在場館售票口領票。如果是旅遊或體驗類商品則要看情況：有些會寄出可直接入場的 QR 或條碼，有些則需要先在現場櫃台把憑證換成實體票。商品頁會說明是哪一種。",
      },
    ],
    labels: ZH_LABELS,
  },
  {
    locale: "id",
    slug: "nol-world-booking-fees-and-checkout-clock",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Checkout NOL World: biaya pemesanan, jamnya, dan mata uang yang Anda bayar",
    summary:
      "Sebuah tiket konser membawa biaya layanan 8,000 won, Anda punya sepuluh menit untuk memilih kursi dan tujuh menit untuk membayar, dan jendela pembayarannya meminta Anda memilih mata uang. Tiga keputusan soal uang dan satu penghitung waktu, semuanya diterbitkan dan tak satu pun jelas dengan sendirinya.",
    scope:
      "Mencakup apa yang NOL World terbitkan tentang biaya dan waktu checkout-nya: biaya layanan menurut genre, penghitung waktu pembelian dua tahap, pemilihan mata uang, kupon, dan batas per pesanan. Biaya dan penghitung waktu bisa ditetapkan per acara dan NOL World menyatakan itu untuk keduanya, jadi halaman acara Anda yang berlaku. Tidak ada di sini yang merupakan nasihat tentang mata uang mana yang lebih murah untuk kartu Anda sendiri.",
    intro: [
      "Sebagian besar yang salah di checkout Korea bukan kartunya. Melainkan bahwa halamannya sedang mengajukan tiga pertanyaan yang melekat pada uang sementara sebuah penghitung waktu berjalan, dan seorang pembeli dari luar negeri menemui semuanya untuk pertama kali dengan sekitar tujuh menit tersisa.",
      "Semuanya diterbitkan, dan tak satu pun ada di halaman produk tempat Anda memutuskan tiketnya terjangkau. Jadi maksud halaman ini adalah memindahkan kejutan-kejutan itu ke pekan sebelumnya.",
    ],
    steps: [
      {
        title: "Tambahkan biaya layanannya sebelum Anda memutuskan tiketnya terjangkau",
        body: "NOL World menerbitkan biaya layanannya menurut genre. Musikal dan konser membawa 8,000 won — tidak termasuk produk tertentu seperti konser daring dan keanggotaan fan club. Pertunjukan lain dan olahraga adalah 3,000 won. Rekreasi dan pameran gratis. NOL World juga menyatakan biayanya bisa berbeda menurut produk dan meminta Anda memeriksanya saat membeli, jadi perlakukan ini sebagai garis dasar yang diterbitkan alih-alih janji tentang acara Anda.",
        pitfall:
          "Membandingkan harga tiket Korea dengan harga tiket di negara Anda dan melupakan bahwa ini duduk di atasnya. Jumlahnya tidak besar, dan ia justru jenis kejutan kecil yang membuat sebuah platform terasa tidak bisa dipercaya pada saat terburuk.",
        takes: "2 menit",
      },
      {
        title: "Ketahui apa yang biaya itu sebenarnya beli, karena satu barisnya penting",
        body: "NOL World merinci apa yang dicakup biaya layanannya: pemeliharaan situs dan biaya terkait, pemrosesan pembayaran yang menopang sistem deteksi penipuannya, biaya teknologi untuk mencegah pemesanan tidak sah lewat bot dan makro, serta dukungan sistem untuk pemesanan global. Butir ketiga itulah yang menarik. Biayanya sebagian mendanai mesin anti-makro, yang merupakan arah penegakan yang sama dengan pemeriksaan identitas dan revisi Undang-Undang Pertunjukan — dan itulah sebabnya antreannya berperilaku seperti sistem yang bermusuhan alih-alih sebuah barisan.",
        pitfall:
          "Membaca biayanya sebagai margin murni dan antreannya sebagai ketidakbecusan. Platformnya sedang memberi tahu Anda bahwa ia membelanjakan biaya itu untuk menahan pembeli otomatis di luar, yang juga sebabnya aturan yang ia kenakan kepada Anda begitu ketat.",
        takes: "2 menit",
      },
      {
        title: "Pahami jamnya: sepuluh menit memilih, tujuh menit membayar",
        body: "Penghitung waktu pembeliannya dua tahap dan NOL World menyatakan keduanya. Sejak memasuki halaman pemesanan Anda punya hingga sepuluh menit untuk memilih kursi. Begitu Anda berpindah ke tahap harga, kursi Anda ditahan selama tujuh menit selagi Anda menyelesaikan pembayaran, dengan penghitung waktu di bagian atas halaman. Lewatkan dan kursinya otomatis dilepas dan Anda memulai pemesanannya lagi. Pemesanan tanpa kursi tertentu atau tiket berdiri tetap mendapat batas sepuluh menit sebelum pembayaran. NOL World menambahkan bahwa batasnya bisa berbeda menurut acara dan bahwa sebagian acara tidak punya batas.",
        pitfall:
          "Membuka aplikasi bank Anda untuk mencari nomor kartu di dalam tujuh menit itu. Detail kartu, alamat penagihan, dan aplikasi persetujuan bank Anda semuanya harus siap sebelum Anda memasuki halaman pemesanan, karena jamnya tidak peduli bahwa ponsel Anda sedang meminta Anda masuk lagi.",
        takes: "17 menit, kalau Anda memakai semuanya",
      },
      {
        title: "Perlakukan pertanyaan mata uang sebagai keputusan yang sungguhan",
        body: "NOL World mendukung pembayaran dalam 24 mata uang termasuk won Korea, dolar Amerika, yen, dan yuan, dan yang tersedia muncul setelah Anda memasukkan detail kartu. Pilihan yang ia tawarkan adalah antara mata uang negara penerbit kartu Anda dan won Korea. Itu dua kurs berbeda yang ditetapkan dua pihak berbeda — satu oleh siapa pun yang mengonversi di halaman pembayaran, satu oleh jaringan kartu dan penerbit Anda. Memilih mata uang Anda sendiri adalah konversi mata uang dinamis, dan pihak yang mengonversi menetapkan kursnya serta mengambil selisih darinya, jadi membayar dalam won biasanya yang lebih murah di antara keduanya. Biasanya, bukan selalu: biaya transaksi luar negeri kartu Anda berlaku pada kedua pilihan, dan selisih penerbit yang buruk bisa menutup jaraknya. Paruh yang benar-benar bisa Anda periksa sebelum hari-H adalah ketentuan penerbit Anda, jadi periksalah itu.",
        pitfall:
          "Memilih mata uang negara Anda karena angkanya terlihat familiar. Yang familiar di sini lebih sering menjadi pilihan yang lebih mahal, dan inilah satu-satunya layar tempat Anda memilih siapa yang melakukan konversinya.",
        takes: "10 menit, bersama bank Anda, sebelumnya",
      },
      {
        title: "Terapkan kuponnya sebelum membayar, karena tidak ada sesudahnya",
        body: "NOL World terang-terangan soal ini: begitu pembayaran selesai Anda tidak bisa menerapkan kupon. Satu-satunya rute yang ia tawarkan adalah membatalkan kursi yang sama dan memesan ulang dengan kuponnya diterapkan — dan ia memperingatkan bahwa membatalkan lalu memesan ulang bisa menimbulkan biaya menurut kebijakan biaya acara itu sendiri, jadi periksa itu lebih dulu. Timbang itu dengan jujur terhadap nilai kuponnya, dan ingat kursi yang Anda lepas tidak dipesan untuk Anda selagi Anda memesan ulang.",
        pitfall:
          "Membatalkan kursi yang benar-benar Anda punya, demi menyelamatkan diskon yang belum tentu sempat Anda pakai. Kuponnya bernilai lebih kecil daripada tiketnya, dan stoknya tidak menunggu.",
        takes: "5 menit",
      },
      {
        title: "Harapkan ada batas tiket, dan harapkan itu milik penyelenggaranya",
        body: "NOL World menyatakan bahwa tergantung penyelenggaranya mungkin ada batas berapa tiket yang bisa dipesan per pesanan atau per anggota untuk sebuah pertunjukan — dan bahwa ketika tiket konser dijual digabung dengan tur atau tiket masuk lain, penyelenggaranya juga bisa mengenakan batas per anggota. Jadi plafonnya bukan angka seluruh platform yang bisa Anda cari; ia ditetapkan per konser, kadang per orang alih-alih per transaksi, dan ia salah satu sebab sebuah pesanan kelompok bisa gagal di langkah terakhir.",
        pitfall:
          "Menyusun pesanan untuk empat orang berdasarkan batas yang Anda baca di konser lain. Batas per anggota juga tidak bisa diakali dengan memecah pesanan ke beberapa akun Anda sendiri — pola itu ada di daftar penggunaan tidak sah yang diterbitkan NOL World.",
        takes: "5 menit",
      },
      {
        title: "Pastikan pemesanannya ada, di tempat yang menampilkan status",
        body: "Setelah pembayaran, buka situs atau aplikasi NOL World dan masuk ke Account/My, lalu My Reservations. NOL World menyatakan detail dan status pemesanan dasar terlihat baik di daftarnya maupun di halaman detail pemesanan. Lakukan itu sekali selagi Anda masih di depan meja alih-alih mengira surel konfirmasi adalah seluruh kebenarannya — daftar pemesanan itulah tempat sebuah status yang tidak seperti harapan Anda muncul, dan itu layar yang akan ditanyakan jika Anda menghubungi layanan pelanggan.",
        pitfall:
          "Memperlakukan pembayaran yang berhasil sebagai pemesanan yang ada. Keduanya biasanya hal yang sama dan seluruh maksud memeriksanya adalah saat keduanya tidak sama.",
        takes: "2 menit",
      },
      {
        title: "Ketahui apa arti selesai bagi barang yang Anda beli",
        body: "Untuk seni pertunjukan dan konser, NOL World menyatakan prosesnya selesai pada pembayaran dan Anda mengambilnya di loket venue. Produk tur dan aktivitas tidak seragam: sebagian menerbitkan QR atau barcode ke My Page atau surel Anda yang mempersilakan Anda masuk langsung, dan sebagian menuntut Anda menunjukkan voucher atau konfirmasi pemesanan di konter di lokasi untuk ditukar dengan tiket fisik sebelum masuk. Instruksi NOL World adalah memeriksa halaman produknya untuk tahu mana yang berlaku, karena perbedaannya menentukan apakah Anda perlu menemukan sebuah konter sebelum pintu masuk.",
        pitfall:
          "Mengira kode QR di surel Anda adalah tiket masuk. Untuk produk berjenis tukar, itu benda yang Anda tukarkan di konter, dan konternya punya jam buka.",
        takes: "5 menit",
      },
    ],
    faq: [
      {
        q: "Berapa biaya pemesanan untuk tiket konser?",
        a: "NOL World menerbitkan 8,000 won untuk musikal dan konser, tidak termasuk produk tertentu seperti konser daring dan keanggotaan fan club; 3,000 won untuk pertunjukan lain dan olahraga; dan nol untuk rekreasi dan pameran. NOL World juga menyatakan biayanya bisa berbeda menurut produk dan meminta Anda memeriksanya saat membeli, jadi pastikan pada acara Anda sendiri.",
      },
      {
        q: "Berapa lama waktu saya sebenarnya di checkout?",
        a: "Sepuluh menit untuk memilih kursi sejak memasuki halaman pemesanan, lalu tahanan tujuh menit selagi Anda membayar, dengan penghitung waktu di bagian atas. Lewati dan kursinya dilepas dan Anda mulai dari awal. Tiket berdiri tetap mendapat sepuluh menit itu. NOL World menyatakan batasnya bisa berbeda menurut acara dan bahwa sebagian acara tidak punya batas.",
      },
      {
        q: "Sebaiknya saya membayar dalam won Korea atau mata uang saya sendiri?",
        a: "Biasanya won. NOL World mendukung 24 mata uang dan membiarkan Anda memilih antara mata uang negara penerbit kartu Anda dan won Korea, ditampilkan setelah Anda memasukkan detail kartu. Memilih mata uang Anda sendiri adalah konversi mata uang dinamis, di mana pihak yang mengonversi menetapkan kursnya dan menambahkan selisih — jadi won umumnya lebih murah. Biaya transaksi luar negeri kartu Anda sendiri berlaku pada kedua pilihan, dan itulah bagian yang perlu Anda periksa ke penerbit sebelum hari-H.",
      },
      {
        q: "Saya lupa memakai kupon saya. Bisakah saya menambahkannya sekarang?",
        a: "Tidak. NOL World menyatakan kupon tidak bisa diterapkan setelah pembayaran selesai. Satu-satunya rute yang ia beri adalah membatalkan kursi yang sama dan memesan ulang dengan kuponnya, dan ia memperingatkan bahwa pembatalan serta pemesanan ulang bisa membawa biaya menurut kebijakan acara itu. Periksa biayanya sebelum Anda melepas kursi yang sudah Anda pegang.",
      },
      {
        q: "Kenapa saya hanya bisa memesan dua tiket sementara teman saya memesan empat?",
        a: "Karena batasnya milik penyelenggaranya, bukan platformnya. NOL World menyatakan sebuah pertunjukan bisa membatasi tiket per pesanan atau per anggota, dan bahwa produk gabungan konser-plus-tur bisa membawa batas per anggota juga. Konser yang berbeda, atau babak penjualan yang berbeda, bisa punya plafon yang berbeda.",
      },
      {
        q: "Bisakah saya memakai kartu kredit Korea di NOL World?",
        a: "Tidak. NOL World hanya menerima kartu yang diterbitkan di luar Korea; kartu terbitan Korea adalah milik anggota domestik terverifikasi di situs berbahasa Korea. Kartu Korea yang ditolak di sini adalah aturan yang sedang bekerja, bukan kerusakan.",
      },
      {
        q: "Di mana saya memeriksa bahwa pemesanan saya berhasil?",
        a: "Situs atau aplikasi NOL World, di bawah Account/My lalu My Reservations. NOL World menyatakan detail dan status pemesanan muncul baik di daftarnya maupun di halaman detailnya. Layar itulah, bukan surel konfirmasi, yang menampilkan status.",
      },
      {
        q: "Saya sudah membayar. Ada yang tersisa untuk dilakukan sebelum konsernya?",
        a: "Untuk tiket konser atau seni pertunjukan, tidak — NOL World menyatakan prosesnya selesai dan Anda mengambilnya di loket venue. Untuk produk tur atau aktivitas itu bergantung: sebagian mengirim QR atau barcode yang mempersilakan Anda masuk langsung, sebagian lain perlu vouchernya ditukar dengan tiket fisik di konter di lokasi lebih dulu. Halaman produknya menyatakan yang mana.",
      },
    ],
    labels: ID_LABELS,
  },
  {
    locale: "de",
    slug: "weverse-shop-shipping-delays-and-cancellation",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Warum Ihre Weverse-Shop-Bestellung spät ist, und wann Sie sie noch stornieren können",
    summary:
      "Die Schaltfläche zum Stornieren verschwindet bei einem Statuswechsel und nicht zu einer festen Uhrzeit, die EU hat ihre Zollfreigrenze von 150 Euro abgeschafft, die USA haben zusätzlich zur Zollprüfung eine zweite Kontrolle eingeführt, und ein koreanischer Feiertag hat einen auf die Minute festgelegten Annahmeschluss.",
    scope:
      "Behandelt, was nach einer Weverse-Shop-Bestellung geschieht, nach den eigenen Mitteilungen des Shops: das Stornofenster, die Zolländerungen, vor denen er für die EU und die USA gewarnt hat, Verzögerungen durch Feiertage und Logistik, und von wem Sie tatsächlich kaufen. Die Feiertagsdaten sind die von 2026 und werden nächstes Jahr falsch sein — die Mitteilungsseite ist die lebende Fassung. Das Bestellen selbst hat eine eigene Anleitung.",
    intro: [
      "Weverse Shop veröffentlicht einen steten Strom von Mitteilungen über Lieferungen, und fast niemand liest sie, bevor ein Paket zu spät ist. Dort stehen die eigentlichen Antworten: welche Zolländerung für Sie gilt, welcher Feiertag vier Tage gefressen hat, und in welcher Minute eine Bestellung nicht mehr stornierbar war.",
      "Dies ist dieser Strom, in einem Zug gelesen. Zwei der folgenden Punkte sind tatsächlich neue Regeln und keine saisonalen Verzögerungen, und einer davon ist der Moment, in dem Ihr Geld nicht mehr erstattungsfähig ist.",
    ],
    steps: [
      {
        title: "Das Stornofenster schließt bei einem Status, nicht bei einer Uhrzeit",
        body: "Das ist die Tatsache, die man kennen sollte, bevor etwas schiefgeht. Weverse Shop nennt als Weg zur Stornierung die Weverse-App, dann More, dann My Orders, dann Order Details, dann Cancel Order — und erklärt, dass Sie die Bestellung nicht mehr stornieren können, sobald der Status auf Shipping Soon oder In Transit wechselt. Es gibt keine genannte Kulanzfrist und keine Regel, die an Stunden nach der Bestellung anknüpft. Das Fenster bleibt offen, bis ein Lager einen Status ändert, und das kann bei einer gefragten Veröffentlichung früher geschehen, als Sie erwarten.",
        pitfall:
          "Über Nacht zu entscheiden, ob eine spontane Vorbestellung bleiben soll. Die Frist ist keine Uhrzeit, die Sie nachschlagen können — sie ist ein Ereignis, das Sie nicht steuern, und sie kann verstreichen, während Sie schlafen.",
        takes: "5 Minuten, sofort",
      },
      {
        title: "Wenn Sie in der EU sind: die Freigrenze von 150 Euro ist weg",
        body: "Die eigene Mitteilung von Weverse Shop ist genau dort konkret, wo allgemeine Berichterstattung vage bleibt. Zum 1. Juli 2026 hat die EU ihre Regeln für geringwertige Einfuhren geändert: zuvor waren Bestellungen unter 150 Euro von Zöllen befreit, diese Befreiung ist entfallen, und Zölle fallen nun unabhängig vom Kaufbetrag an. Entscheidend ist die Bezugsgröße — Weverse schreibt, dass dies für Sendungen gilt, die ab dem 1. Juli 2026 die örtliche Zollabfertigung durchlaufen, also nach dem Abfertigungsdatum vor Ort und nicht nach dem Bestelldatum. Eine vor der Änderung aufgegebene Bestellung kann trotzdem erfasst werden.",
        pitfall:
          "Anzunehmen, eine kleine Bestellung sei zu günstig, um zollpflichtig zu sein. Es gibt keine Untergrenze mehr, und das Datum, das darüber entscheidet, sehen Sie auf der Bestellseite nicht.",
        takes: "10 Minuten",
      },
      {
        title: "Rechnen Sie damit, dass Zoll oder Zusteller direkt Geld von Ihnen verlangen",
        body: "Weverse Shop schreibt, dass bei EU-Bestellungen während der örtlichen Abfertigung Zölle anfallen können, dass Sie gesonderte Zahlungsanweisungen vom örtlichen Zoll oder vom Zusteller erhalten können, und dass eine Nichtzahlung die Zustellung verzögern oder verhindern kann. Das ist etwas anderes als eine Belastung an der Kasse: Es kommt eine Nachricht von einem Unternehmen, zu dem Sie keine Beziehung haben, und verlangt Geld, bevor sich ein bereits bezahltes Paket bewegt. Das ist nicht von vornherein Betrug — aber es ist genau das, was Betrug nachahmt. Prüfen Sie daher die Sendungsnummer gegen Ihre Bestellung, statt einem Link in der Nachricht zu folgen.",
        pitfall:
          "Eine Zahlungsaufforderung von Zoll oder Zusteller als Phishing abzutun und das Paket liegen zu lassen. Nichtzahlung ist einer der dokumentierten Wege, auf denen eine Bestellung schlicht nie ankommt.",
        takes: "—",
      },
      {
        title: "Wenn Sie in den USA sind: es sind zwei getrennte Änderungen, nicht eine",
        body: "Die Zolländerung bekommt die ganze Aufmerksamkeit und ist nicht das Einzige, was US-Pakete ausbremst. Weverse Shop warnt gesondert, dass die US Consumer Product Safety Commission ab dem 8. Juli 2026 eine verpflichtende eFiling-Regelung durchsetzt, was strengere örtliche Zollkontrollen für alle in die USA eingeführten Waren bedeutet, und dass die Abfertigung voraussichtlich einige Tage länger dauert als die übliche Lieferzeit. Das ist eine Meldepflicht zur Produktsicherheit und kein Zoll — eine US-Bestellung kann also aus einem Grund langsam sein, der mit der Höhe des Zolls nichts zu tun hat.",
        pitfall:
          "Jede US-Verzögerung als Folge der Freigrenzen-Änderung zu lesen und auf eine Zollrechnung zu warten, die nie kommt. Eine dieser beiden Änderungen kostet Geld, die andere kostet Tage.",
        takes: "5 Minuten",
      },
      {
        title: "Behandeln Sie einen koreanischen Feiertag als minutengenauen Annahmeschluss",
        body: "Weverse Shop veröffentlicht zu jedem koreanischen Feiertag einen Zeitplan, und die Zeiten sind präzise. Für Chuseok 2026 lag der Bestellschluss für Adressen außerhalb Südkoreas am 23. September um 11:00 KST, der Expressversand wurde am 28. September wieder aufgenommen; für koreanische Adressen lag der Annahmeschluss des Zustellers am 22. September um 11:00 KST, mit Wiederaufnahme am selben Tag. Nach dem Annahmeschluss aufgegebene Bestellungen gehen ab dem Wiederaufnahmedatum der Reihe nach raus. Weverse fügt zwei Einschränkungen hinzu: Am Tag des Annahmeschlusses versandte Artikel können je nach Region trotzdem nach dem Feiertag ankommen, und der Zeitplan kommt vom Zusteller und kann sich ändern.",
        pitfall:
          "Diese Daten für die des laufenden Jahres zu halten. Es sind die Chuseok-Werte von 2026, und das Muster — ein Annahmeschluss um 11:00 KST ein bis zwei Tage vorher, Wiederaufnahme etwa eine Woche später — ist der Teil, der sich überträgt. Die Daten selbst müssen jedes Mal nachgeschlagen werden.",
        takes: "10 Minuten vor einer Feiertagsbestellung",
      },
      {
        title: "Wenn Ihre Adresse in China liegt, gilt ein zweiter Feiertagskalender",
        body: "Weverse Shop gibt gesonderte Mitteilungen zu chinesischen Feiertagen heraus, die Bestellungen mit Lieferadressen in China betreffen, weil chinesische Zollstellen schließen und die Abfertigung stillsteht. Für das Mittherbstfest 2026 vom 25. bis 27. September und den Nationalfeiertag vom 1. bis 7. Oktober hieß es, dass vollständig bis zum 15. September um 11:00 KST bezahlte Bestellungen voraussichtlich während der Nationalfeiertage zugestellt würden, und dass später bezahlte Bestellungen erst nach dem Ende der Feiertage am 8. Oktober in den Versand gehen. Beachten Sie: es zählt die vollständige Zahlung, nicht die Aufgabe der Bestellung.",
        pitfall:
          "Eine Vorbestellung, deren Zahlung später abgeschlossen wird, als Sie denken. Wo der Annahmeschluss an der vollständigen Zahlung hängt, liegt eine unbezahlte Bestellung auf der anderen Seite einer dreiwöchigen Lücke.",
        takes: "10 Minuten",
      },
      {
        title: "Unterscheiden Sie eine Frachtstörung von einem verlorenen Paket",
        body: "Manche Verzögerungen sind weder Zoll noch Feiertage. Im April 2026 informierte Weverse Shop über Lieferverzögerungen in ganz Europa und ausgewählten Ländern des Nahen Ostens, verursacht durch Schwankungen globaler Logistikrouten sowie Luft- und Seefrachtpläne, betroffen waren nach dem 1. April 2026 versandte Sendungen im internationalen Transit. Nützlich ist, was über die Sendungsverfolgung gesagt wird: wegen der Umleitungen können Aktualisierungen und die Ankunft vor Ort länger dauern als üblich, und das Paket ist weiterhin unterwegs. Eine stumme Sendungsverfolgung während einer bekannten Störung ist das erwartete Symptom und kein Beleg für einen Verlust.",
        pitfall:
          "Eine Verlustmeldung zu eröffnen, weil sich die Sendungsverfolgung eine Woche lang nicht bewegt hat. Prüfen Sie zuerst die Mitteilungsseite auf eine laufende Störung für Ihre Region — eine Meldung gegen ein lediglich umgeleitetes Paket verbraucht die Zeit, die Sie für einen echten Fall bräuchten.",
        takes: "10 Minuten",
      },
      {
        title: "Prüfen Sie, ob Weverse überhaupt der Verkäufer ist",
        body: "Weverse Shop erklärt auf den eigenen Seiten, dass einige Produkte von einzelnen Drittanbietern angeboten werden, dass Weverse Company in diesen Fällen ausschließlich als Vermittler im elektronischen Handel auftritt und nicht Partei des Geschäfts ist, und dass keine Verantwortung für die Produktangaben oder die Geschäfte dieser Verkäufer übernommen wird. Das ändert, mit wem Sie es zu tun haben, wenn etwas nicht stimmt — bei einem Artikel eines Drittanbieters ist der Vertragspartner der Verkäufer und nicht Weverse. Das klärt man besser, bevor man sich beschweren muss, als mittendrin.",
        pitfall:
          "Anzunehmen, alles im Shop habe dieselbe Absicherung, weil es hinter derselben Kasse liegt. Der Vermittlerhinweis ist veröffentlicht, und er entscheidet, wer Ihnen Abhilfe schuldet.",
        takes: "5 Minuten",
      },
      {
        title: "Lesen Sie die Mitteilungen selbst, denn diese Seite veraltet schneller als die meisten",
        body: "Alles Obenstehende stammt von der Mitteilungsseite von Weverse Shop, und diese Seite ist die lebende Fassung. Die Zolländerungen sind dauerhaft; die Feiertagspläne, die Frachtstörungen und die Annahmeschlüsse der Zusteller sind es nicht — sie werden zu jedem Anlass neu herausgegeben und ersetzt, ohne dass sich die alte Mitteilung ändert. Lesen Sie vor einer Feiertagsbestellung oder bei einem verspäteten Paket die Mitteilungsliste, statt den Daten irgendeiner Anleitung zu vertrauen, auch dieser nicht. Das Datum oben auf dieser Seite ist der Tag, an dem wir das zuletzt getan haben.",
        pitfall:
          "Einer Annahmeschlusszeit aus einer im Vorjahr geschriebenen Anleitung zu vertrauen. Die Struktur wiederholt sich, die Zahlen nicht.",
        takes: "5 Minuten",
      },
    ],
    faq: [
      {
        q: "Kann ich meine Bestellung noch stornieren?",
        a: "Nur solange der Status es zulässt. Der Weg von Weverse Shop lautet Weverse-App, More, My Orders, Order Details, Cancel Order — und es heißt, dass eine Stornierung nicht mehr möglich ist, sobald der Status auf Shipping Soon oder In Transit wechselt. Eine veröffentlichte Kulanzfrist gibt es nicht, die Antwort hängt also an der Bestellung und nicht an der Uhr.",
      },
      {
        q: "Ich bin in der EU und habe eine Zollrechnung. Ist das richtig so?",
        a: "Wahrscheinlich ja. Weverse Shop schreibt, dass die EU zum 1. Juli 2026 die Zollbefreiung abgeschafft hat, die zuvor Bestellungen unter 150 Euro erfasste, sodass Zölle nun unabhängig vom Betrag anfallen, bezogen auf Sendungen, die ab diesem Datum die örtliche Zollabfertigung durchlaufen. Es wird außerdem gewarnt, dass Sie gesonderte Zahlungsanweisungen vom Zoll oder vom Zusteller erhalten können und dass eine Nichtzahlung die Zustellung verzögern oder verhindern kann.",
      },
      {
        q: "Warum ist meine US-Bestellung langsam, wenn kein Zoll zu zahlen ist?",
        a: "Weil es zwei Änderungen gibt. Neben den Zollregeln warnt Weverse Shop, dass die US Consumer Product Safety Commission ab dem 8. Juli 2026 ein verpflichtendes eFiling durchsetzt, was strengere Kontrollen für alle in die USA eingeführten Waren bedeutet, mit voraussichtlich einigen Tagen längerer Abfertigung. Diese kostet Zeit statt Geld.",
      },
      {
        q: "Ich habe eine Nachricht bekommen, die Zollgebühren verlangt. Ist das Betrug?",
        a: "Sie kann durchaus echt sein — Weverse Shop schreibt, dass Kundinnen und Kunden in der EU gesonderte Zahlungsanweisungen vom örtlichen Zoll oder vom Zusteller erhalten können. Sie ist zugleich genau das, was Betrug nachahmt. Prüfen Sie, indem Sie die Sendungsnummer mit Ihrer eigenen Bestellung abgleichen und selbst auf die Seite des Zustellers gehen, statt einem Link in der Nachricht zu folgen.",
      },
      {
        q: "Wie lautet der Annahmeschluss für eine Bestellung zu einem koreanischen Feiertag?",
        a: "Weverse Shop veröffentlicht zu jedem Feiertag einen, minutengenau. Für Chuseok 2026 lag der Annahmeschluss für Adressen außerhalb Koreas am 23. September um 11:00 KST, der Expressversand wurde am 28. September wieder aufgenommen. Es wird gewarnt, dass der Zeitplan vom Zusteller kommt und sich ändern kann und dass am Tag des Annahmeschlusses versandte Artikel trotzdem nach dem Feiertag ankommen können. Schlagen Sie den aktuellen nach, statt diese Daten wiederzuverwenden.",
      },
      {
        q: "Meine Sendungsverfolgung hat sich seit einer Woche nicht aktualisiert. Ist mein Paket verloren?",
        a: "Prüfen Sie zuerst die Mitteilungsseite auf eine Störung für Ihre Region. Als Weverse Shop im April 2026 Verzögerungen für Europa und den Nahen Osten meldete, hieß es, dass Umleitungen dazu führen, dass Aktualisierungen der Sendungsverfolgung und die Ankunft vor Ort länger dauern als üblich und das Paket weiterhin unterwegs ist — eine stehende Sendungsverfolgung während einer bekannten Störung ist also das Symptom und nicht das Problem.",
      },
      {
        q: "Mit meinem Artikel stimmt etwas nicht. Wende ich mich an Weverse?",
        a: "Nicht immer. Weverse Shop erklärt, dass einige Produkte von einzelnen Drittanbietern verkauft werden, dass Weverse Company dann ausschließlich als Vermittler auftritt und nicht Partei des Geschäfts ist, und dass keine Verantwortung für die Produktangaben oder Geschäfte dieser Verkäufer übernommen wird. Prüfen Sie, welche Art von Artikel Sie gekauft haben, bevor Sie entscheiden, an wen Sie sich wenden.",
      },
      {
        q: "Betrifft mich der chinesische Feiertagsplan, wenn ich nicht in China bin?",
        a: "Die Mitteilungen besagen, dass diese Pläne für Bestellungen mit Lieferadressen in China gelten, weil chinesische Zollstellen über die Feiertage schließen. Liegt Ihre Adresse anderswo, sind stattdessen die koreanischen Feiertagsfristen und eine etwaige laufende Frachtstörung die relevanten.",
      },
    ],
    labels: DE_LABELS,
  },
  {
    locale: "de",
    slug: "order-from-weverse-shop-overseas",
    sourceChecked: "2026-10-21",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Im Weverse Shop außerhalb Koreas bestellen",
    summary:
      "In welchem Shop Sie sich befinden, warum sich der Preis an der Kasse ändert, welche Zahlungsarten Ihre Währung tatsächlich bekommt, und in welche Länder Korea nicht versenden kann.",
    scope:
      "Behandelt das Bestellen im Weverse Shop für physische Waren und Alben, die aus Korea versandt werden. Der Kauf von Mitgliedschaften und Tickets wird getrennt behandelt und in der Vorverkaufs-Anleitung beschrieben. Die Regeln hier stammen aus den eigenen Mitteilungen des Weverse Shops und ändern sich ohne große Vorwarnung.",
    intro: [
      "Nahezu jede englischsprachige Anleitung zum Weverse Shop behauptet bis heute, der globale Shop nehme nur PayPal oder Eximbay. Das stimmte vor Jahren. Die Liste der Zahlungsarten ist inzwischen länger, sie richtet sich nach der im Konto eingestellten Währung und nicht nach Ihrem Wohnsitzland, und seit Februar 2026 ist der Preis auf der Produktseite nicht der Preis, den Sie zahlen.",
      "Nichts davon ist versteckt — es steht in den eigenen Mitteilungen des Shops, und von dort stammt alles Folgende. Nur ist niemand, der diese Anleitungen schreibt, hingegangen und hat sie gelesen.",
    ],
    steps: [
      {
        title: "Finden Sie heraus, in welchem Weverse Shop Sie eigentlich sind",
        body: "Der Weverse Shop ist nicht ein Laden. Es gibt einen GLOBAL-Shop und es gibt Regional-Shops, und sie führen unterschiedliche Bestände, haben unterschiedliche Vorbestellzeiträume und versenden von unterschiedlichen Orten. Ein Artikel, den jemand anderes bestellt hat, existiert in Ihrem Shop möglicherweise schlicht nicht. Prüfen Sie, in welchem Sie sind, bevor Sie um ein Erscheinungsdatum herum planen, denn ein Vorbestellschluss in einem Shop sagt nichts über die anderen aus.",
        pitfall:
          "Ein in einer Fan-Community geteilter Link öffnet deren Shop, nicht Ihren. Wenn die Seite lädt, der Artikel sich aber nicht in den Warenkorb legen lässt, sind Sie meist im falschen Shop und nicht zu spät.",
        takes: "2 Minuten",
      },
      {
        title: "Stellen Sie Ihre Währung ein, bevor Sie sich irgendetwas ansehen",
        body: "Ihre Standardwährung entscheidet, welche Zahlungsarten Ihnen angeboten werden. Weverse nennt sie je Währung: USD bekommt PayPal, Eximbay, Alipay+, Apple Pay, WeChat Pay und Grab Pay. JPY bekommt dieselbe Liste ohne Grab Pay. Bei CNY entfällt PayPal. MXN hat nur PayPal und Apple Pay. KRW ergänzt koreanische Karten und die koreanischen Wallets — Toss, NAVER Pay, Kakao Pay, PAYCO. MXN ist die kürzeste der vier Listen außerhalb des koreanischen Won und die, um die herum zu planen sich lohnt: zwei Methoden, beide digital, keine Barzahlung. Ist keine von beiden eingerichtet, gibt es an der Kasse keinen dritten Knopf.",
        pitfall:
          "Außerhalb von KRW gibt es kein schlichtes „mit Visa bezahlen“. Ihre Karte läuft über PayPal oder Eximbay, und für Ihre Bank ist das eine andere Art von Transaktion als eine Belastung durch einen koreanischen Händler — und genau deshalb kann eine Karte, die anderswo funktioniert, hier trotzdem abgelehnt werden.",
        takes: "3 Minuten",
      },
      {
        title: "Rechnen Sie damit, dass der Preis an der Kasse steigt, und wissen Sie warum",
        body: "Seit dem 3. Februar 2026 berechnet Weverse die Steuer anhand Ihrer Liefer- und Rechnungsadresse. Bestellungen nach Korea zeigen durchgehend Preise inklusive Steuer. Bestellungen in alle anderen Länder zeigen auf der Produktseite den Preis ohne Steuer, und die Steuer des Ziellandes wird an der Kasse hinzugerechnet, sobald Sie eine Adresse eingeben. Die Zahl auf der Produktseite ist nicht die Zahl, die Sie zahlen, und das ist Absicht und kein Fehler.",
        pitfall:
          "Das sieht genau wie Betrug oder ein Fehler aus, und an dieser Stelle brechen Leute die Bestellung ab. Der Aufschlag ist die Steuer, die Ihr eigenes Land erhebt, nur vorab eingezogen statt später durch den Zoll.",
        takes: "1 Minute",
      },
      {
        title: "Füllen Sie die Rechnungsadresse aus, nicht nur die Lieferadresse",
        body: "Dieselbe Änderung vom Februar 2026 hat an der Kasse ein Feld für die Rechnungsadresse ergänzt, weil die Steuerberechnung sie braucht. Bei manchen unkörperlichen Produkten — digitalen Artikeln und Inhalten — kann die Rechnungsadresse Pflicht statt freiwillig sein. Tragen Sie sie korrekt ein: daraus wird der Steuersatz berechnet, und eine falsche Angabe lässt sich später nicht still korrigieren.",
        pitfall:
          "Die Lieferadresse gedankenlos in das Rechnungsfeld zu kopieren, ist richtig, wenn beide übereinstimmen, und falsch, wenn nicht. Ist Ihre Karte auf eine andere Adresse ausgestellt, nehmen Sie diese.",
        takes: "2 Minuten",
      },
      {
        title: "Prüfen Sie die Sprache Ihrer Adresse gegen das Zielland",
        body: "Weverse bittet internationale Kundinnen und Kunden, vor der Eingabe zu prüfen, in welcher Sprache das Zielland die Adresse benötigt. In die andere Richtung ist die Regel klarer: eine Bestellung nach Südkorea muss die Adresse auf Koreanisch tragen, weil Zusteller eine englische möglicherweise nicht annehmen oder falsch verarbeiten. Für alle anderen Ziele schreiben Sie die Adresse so, wie es Ihre eigene Post erwartet.",
        pitfall:
          "Eine koreanische Adresse ins Englische zu übertragen ist die mit Abstand häufigste Ursache für eine verspätete oder gescheiterte Zustellung bei Bestellungen nach Korea.",
        takes: "5 Minuten",
      },
      {
        title: "Vergewissern Sie sich, dass Korea überhaupt zu Ihnen versenden kann",
        body: "Der Versand aus Südkorea ist in eine Reihe von Ländern und Regionen nicht möglich, deren Liste Weverse pflegt und aktualisiert. In der Fassung vom 15. Juli 2026 umfasst sie Myanmar, die Demokratische Republik Kongo, Irak, Iran, Libanon, Mali, Russland, Andorra, die Ukraine, Belarus, Afghanistan, die Niederländischen Antillen, Israel und die Türkei. Die Liste bewegt sich, prüfen Sie also die Mitteilung und nicht diese Seite.",
        pitfall:
          "Die Liste wird als vorübergehende Störung und nicht als Politik beschrieben, was bedeutet, dass ein Land ebenso wieder herunterkommen wie hinzukommen kann. Weder eine frühere erfolgreiche Bestellung noch die einer Freundin im letzten Jahr entscheidet, ob Sie heute bestellen können.",
        takes: "2 Minuten",
      },
      {
        title: "Bestellen Sie innerhalb des Vorbestellzeitraums, wenn die Beigaben zählen",
        body: "Vorbestellprämien — die Poster, Photocards und Erstauflagen-Beigaben, die meist überhaupt erst der Grund sind, im offiziellen Shop statt irgendwo günstiger zu bestellen — hängen am Vorbestellzeitraum und nicht am Album. Ist der Zeitraum vorbei, wird dasselbe Album ohne sie versandt. Wenn es Ihnen um die Beigaben geht, ist die Frist das, worum herum zu planen ist, und nicht das Erscheinungsdatum.",
        pitfall:
          "Vorbestellzeiträume enden zu einer koreanischen Uhrzeit, und das ist für die meisten Leserinnen und Leser dieser Seite der Vorabend oder die frühen Morgenstunden.",
        takes: "Vor dem Fristende",
      },
    ],
    faq: [
      {
        q: "Kann ich im Weverse Shop mit Visa oder Mastercard bezahlen?",
        a: "Nicht als direkte Kartenoption außerhalb der koreanischen Währungseinstellung. Bei USD, JPY, CNY und MXN läuft die Karte stattdessen über PayPal oder Eximbay. Das erreicht weiterhin Ihre Karte, aber Ihre Bank sieht eine andere Art von Transaktion, weshalb es sich lohnt, Auslandszahlungen vorab freizuschalten.",
      },
      {
        q: "Warum ist der Preis gestiegen, als ich meine Adresse eingegeben habe?",
        a: "Seit dem 3. Februar 2026 werden Preise außerhalb Koreas auf der Produktseite ohne Steuer angezeigt, und die Steuer für Ihr Zielland kommt an der Kasse hinzu. Es ist die Steuer, die Ihr eigenes Land erhebt, eingezogen beim Kauf statt bei der Zustellung.",
      },
      {
        q: "Werden bei der Ankunft Zollgebühren fällig?",
        a: "Weverse zahlt für infrage kommende Bestellungen Zölle und Steuern inzwischen an der Kasse vorab, was nach eigenen Angaben den Bedarf an zusätzlichen Zahlungen während der Abfertigung verringert. Es wird ausdrücklich gesagt, dass dies nicht für jedes Land oder jede Region gilt — es ist also eine begründete Erwartung und keine Garantie.",
      },
      {
        q: "Ich bin in Mexiko. Welche Zahlungsmethoden bekomme ich tatsächlich?",
        a: "Zwei. Der Zahlungshinweis von Weverse führt MXN als PayPal und Apple Pay — die kürzeste der vier Listen außerhalb des koreanischen Won, und beide digital. Es gibt keine Barzahlung und keinen dritten Knopf, richten Sie also eine der beiden vor einem Vorbestellfenster ein und nicht darin.",
      },
      {
        q: "Versendet der Weverse Shop in mein Land?",
        a: "In der Regel ja, aber es gibt eine gepflegte Liste von Ländern und Regionen, die derzeit keinen Versand aus Südkorea erhalten können. Prüfen Sie vor der Bestellung die aktuelle Liste in jener Mitteilung — sie wird überarbeitet, wenn sich die Lage ändert.",
      },
    ],
    labels: DE_LABELS,
  },
  {
    locale: "de",
    slug: "buy-k-pop-albums-from-overseas",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "K-Pop-Alben aus dem Ausland so kaufen, dass sie zählen",
    summary:
      "Wo Sie kaufen, entscheidet darüber, ob Ihr Kauf gezählt wird, was Sie für den Versand zahlen und ob Sie die Vorbestellprämien bekommen. So wählen Sie.",
    scope:
      "Behandelt den Kauf offizieller physischer Alben und Waren mit Lieferung außerhalb Koreas. Wiederverkaufsplattformen und inoffizielle Merchandise-Artikel sind nicht erfasst.",
    intro: [
      "Anders als bei Tickets läuft diese Frage das ganze Jahr über — deshalb steht sie hier neben ihnen. Und anders als bei Tickets gibt es eine falsche Antwort, die sichtbar nichts kostet: Ihr Album kommt an, es wurde nur nicht gezählt.",
      "Drei Dinge hängen davon ab, wo Sie kaufen: ob der Verkauf an die koreanischen Charts gemeldet wird, ob die Vorbestellprämien mitkommen, und was die Bestellung wirklich kostet, wenn Versand und Zoll eingerechnet sind. Sie bewegen sich nicht gemeinsam, weshalb die günstigste Option häufig genau die ist, die für nichts zählt.",
    ],
    steps: [
      {
        title: "Entscheiden Sie, was Sie von dem Kauf eigentlich wollen",
        body: "Chart-Beitrag, das physische Album, die Vorbestellprämien oder der niedrigste Preis. Diese Ziele ziehen in verschiedene Richtungen. Legen Sie die Priorität fest, bevor Sie den Shop wählen, denn der Shop ergibt sich daraus.",
        pitfall:
          "Auf einem allgemeinen Marktplatz zu kaufen, um Geld zu sparen, und dann festzustellen, dass es nicht gezählt wurde, ist die Standardfassung dieses Fehlers.",
        takes: "5 Minuten",
      },
      {
        title: "Prüfen Sie, ob der Verkäufer an die koreanischen Charts meldet",
        body: "An die koreanischen Albumcharts gemeldete Verkäufe stammen von bestimmten Händlern und offiziellen Shops. Dass ein Angebot ein offizielles Album ist, bedeutet nicht, dass der Verkauf gemeldet wurde. Wenn der Chart-Beitrag der Grund für Ihren Kauf ist, vergewissern Sie sich vor der Bestellung, dass der Händler zu den meldenden gehört.",
        pitfall:
          "Angebote echter Alben auf Drittanbieter-Marktplätzen zählen üblicherweise nicht. Das Album ist echt; der Beitrag ist nicht da.",
        takes: "15 Minuten",
      },
      {
        title: "Bestellen Sie für die Beigaben innerhalb des Vorbestellzeitraums",
        body: "Vorbestellprämien — Poster, zusätzliche Photocards, Teilnahmen an Veranstaltungen — hängen daran, innerhalb eines bestimmten Zeitraums zu bestellen, und oft an genau diesem Händler. Der Zeitraum endet vor dem Erscheinungstag, nicht an ihm.",
        pitfall:
          "Händlerexklusive Beigaben sind nicht austauschbar. Dasselbe Album woanders zu bestellen bringt einen anderen Satz oder gar keinen.",
        takes: "10 Minuten",
      },
      {
        title: "Rechnen Sie Versand und Zollrisiko aus, nicht den Albumpreis",
        body: "Der Versand aus Korea kann den Albumpreis übersteigen, und ob Sie darüber hinaus Einfuhrabgaben zahlen, hängt von den Regeln Ihres eigenen Landes ab. Prüfen Sie diese jetzt, statt etwas anzunehmen: Die Vereinigten Staaten haben ihre Freigrenze von 800 Dollar im August 2025 ausgesetzt, und die EU hat ihre Grenze von 150 Euro am 1. Juli 2026 abgeschafft — für Leserinnen und Leser in beiden Räumen gibt es also keinen Betrag mehr, der klein genug wäre, um abgabenfrei anzukommen. Sammelbestellungen senken die Versandkosten je Artikel. Rechnen Sie die Gesamtkosten aus, bevor Sie sich festlegen.",
        pitfall:
          "Um eine Freigrenze herum zu planen, die es dort, wo Sie leben, nicht mehr gibt. Und wo es noch eine gibt, kann das Bündeln mehrerer Alben in ein Paket den angemeldeten Wert über die Grenze heben und teurer werden als getrennter Versand — rechnen Sie beides durch.",
        takes: "20 Minuten",
      },
      {
        title: "Bewahren Sie den Bestellnachweis auf, bis die Ware da ist",
        body: "Sichern Sie die Bestätigung, die Sendungsnummer und den angemeldeten Wert. Für alles, was schiefgeht — ein beschädigtes Paket, eine Rückfrage des Zolls, eine fehlende Beigabe — ist genau das, wonach der Händler Sie fragen wird.",
        pitfall:
          "Der Kundendienst koreanischer Händler arbeitet oft mit Bestellnummern statt mit einer Suche nach der E-Mail-Adresse. Ohne die Nummer wird das Gespräch zäh.",
        takes: "5 Minuten",
      },
    ],
    faq: [
      {
        q: "Zählen außerhalb Koreas gekaufte Alben für die koreanischen Charts?",
        a: "Von teilnehmenden Händlern gemeldete Verkäufe zählen, und das hängt am Händler und nicht an Ihrem Standort. Ein echtes Album bei einem Shop zu kaufen, der nicht meldet, bedeutet: das Album ist echt, der Verkauf wird nicht gezählt. Prüfen Sie den Händler vor der Bestellung, wenn es Ihnen um den Chart-Beitrag geht.",
      },
      {
        q: "Lohnt sich eine Sammelbestellung?",
        a: "Für den Versand meist ja, weil die Kosten je Artikel deutlich sinken. Wägen Sie das gegen die Einfuhrregeln Ihres Landes ab — wo es noch eine Freigrenze gibt, kann ein einzelnes hochwertiges Paket Abgaben auslösen, die mehrere kleinere nicht ausgelöst hätten. In den Vereinigten Staaten und der EU hat sich diese Rechnung geändert: beide haben ihre Befreiungen für geringe Werte abgeschafft, es bleibt also keine Grenze, unter der man bleiben könnte.",
      },
      {
        q: "Warum sind die Vorbestellprämien bei den Shops unterschiedlich?",
        a: "Händler verhandeln ihre eigenen exklusiven Beigaben, dasselbe Album trägt also je nach Ort der Vorbestellung andere Extras. Wenn Sie eine bestimmte Beigabe wollen, müssen Sie bei dem Shop bestellen, der sie anbietet, und zwar innerhalb seines Zeitraums.",
      },
    ],
    labels: DE_LABELS,
  },
  {
    locale: "de",
    slug: "foreign-card-declined-korean-ticketing",
    sourceChecked: "2026-10-14",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Warum Ihre Karte auf einer koreanischen Ticketseite abgelehnt wurde",
    summary:
      "Drei verschiedene Systeme können dieselbe Zahlung ablehnen — die Plattform, Ihr Kartennetz und Ihre Bank. Jedes hat eine andere Lösung, und nur eine davon ist schnell.",
    scope:
      "Behandelt Zahlungen mit im Ausland ausgestellten Karten auf koreanischen Ticketplattformen. Keine Finanzberatung, und die Regeln Ihrer eigenen Bank kann diese Seite nicht abdecken.",
    intro: [
      "Eine abgelehnte Karte im Zahlungsschritt ist der teuerste Fehlschlag beim K-Pop-Ticketkauf, denn ein reservierter Platz geht binnen Minuten zurück in den Pool. Fast alles davon lässt sich mit etwas Vorlauf verhindern.",
      "Es wirkt deshalb zufällig, weil drei voneinander unabhängige Systeme dieselbe Transaktion ablehnen können und die Fehlermeldung, die Sie sehen, selten verrät, welches es war. Arbeiten Sie sie in der Reihenfolge ab, wie lange ihre Behebung jeweils dauert.",
    ],
    steps: [
      {
        title: "Prüfen Sie, ob Ihre Kontoverifizierung wirklich abgeschlossen ist",
        body: "Auf mehreren Plattformen funktionieren im Ausland ausgestellte Karten erst, wenn das Konto als Konto einer ausländischen Kundin oder eines ausländischen Kunden verifiziert wurde. Läuft diese Prüfung noch, scheitert die Karte, so gesund sie auch sein mag. Das ist die langsamste Lösung, und deshalb steht sie zuerst.",
        pitfall:
          "Die Fehlermeldung wird nicht sagen „Ihre Verifizierung läuft noch“. Sie wird wie ein Kartenproblem aussehen.",
        takes: "1-3 Tage",
      },
      {
        title: "Sagen Sie Ihrer Bank vor dem Verkaufsstart Bescheid, nicht danach",
        body: "Schalten Sie internationale Zahlungen und Online-Zahlungen frei, und lassen Sie, falls Ihre Bank das unterstützt, den Betragsrahmen und das Land vorab autorisieren. Eine erstmalige Belastung durch einen koreanischen Händler zu ungewöhnlicher Stunde ist genau das Profil, das ein Betrugssystem blockiert.",
        pitfall:
          "Automatische Betrugssperren bleiben auf Ihrer Seite oft stumm — keine SMS, keine Benachrichtigung in der App. Sie erfahren davon nur durch die nichtssagende Ablehnung beim Händler.",
        takes: "1 Tag",
      },
      {
        title: "Führen Sie den Zahlungsschritt nicht im In-App-Browser aus",
        body: "3-D Secure und die Einmalpasswort-Abläufe von Banken scheitern häufig in dem Browser, der in einer Social-Media- oder Messenger-App eingebettet ist. Nutzen Sie einen normalen Browser am Telefon oder am Rechner, und stellen Sie sicher, dass Sie die Bestätigungsnachricht Ihrer Bank auf demselben Gerät empfangen können.",
        pitfall:
          "Die Weiterleitung kann erfolgreich aussehen und die Autorisierung dann still verlieren, was sich wie eine Ablehnung liest.",
        takes: "0 Minuten, machen Sie es einfach richtig",
      },
      {
        title: "Halten Sie eine wirklich andere Karte bereit, keine Schwesterkarte",
        body: "Eine zweite Karte desselben Herausgebers scheitert meist aus demselben Grund. Ein anderer Herausgeber, ein anderes Netz oder die unterstützte Alternativmethode der Plattform, falls vorhanden, ist eine echte Rückfalloption. Die beiden Auslandsplattformen lehnen außerdem Gegensätzliches ab, was man wissen sollte, bevor man die Karte beschuldigt: NOL World akzeptiert VISA, MasterCard, AMEX, JCB und UnionPay, aber nur außerhalb Koreas ausgestellt, und lehnt in Korea ausgestellte Karten rundweg ab. YES24 Global macht es bei zweien davon umgekehrt und schließt außerhalb Koreas ausgestellte American Express sowie UnionPay vollständig aus. Eine auf der einen Seite abgelehnte Karte kann auf der anderen die richtige sein.",
        pitfall:
          "Zwei Karten derselben Bank sind für eine Betrugsregel eine Karte.",
        takes: "30 Minuten Vorbereitung",
      },
      {
        title: "Prüfen Sie Währung und Betrag, bevor Sie bestätigen",
        body: "Lesen Sie nach, ob Ihnen in KRW oder in einem umgerechneten Betrag belastet wird, und kennen Sie die Auslandsgebühr Ihrer Karte. Eine Umrechnung, die die Summe über ein von Ihnen selbst gesetztes Limit hebt, kann ebenfalls zu einer Ablehnung führen.",
        pitfall:
          "Die dynamische Währungsumrechnung verteuert still. In KRW zu zahlen ist in der Regel die günstigere Wahl.",
        takes: "5 Minuten",
      },
    ],
    faq: [
      {
        q: "Warum wurde meine Karte abgelehnt, obwohl Geld darauf ist?",
        a: "Meist eine von drei Ursachen: Ihr Plattformkonto hat die Verifizierung als ausländische Kundschaft nicht abgeschlossen, das Betrugssystem Ihrer Bank hat einen unbekannten ausländischen Händler blockiert, oder ein 3-D-Secure-Schritt ist gescheitert — häufig, weil er im In-App-Browser lief. Die Ablehnungsmeldung unterscheidet das in der Regel nicht.",
      },
      {
        q: "Funktioniert PayPal?",
        a: "Manche auf Auslandskundschaft ausgerichteten Plattformen unterstützen bei manchen Veranstaltungen alternative Zahlungsarten. Das wird je Plattform und je Veranstaltung festgelegt und gilt nicht allgemein, prüfen Sie also die auf Ihrer Veranstaltungsseite genannten Zahlungsoptionen, bevor Sie damit planen.",
      },
      {
        q: "Soll ich in KRW oder in meiner eigenen Währung zahlen?",
        a: "In der Währung des Händlers zu zahlen ist in der Regel günstiger, als die Zahlungsseite umrechnen zu lassen, weil die dynamische Währungsumrechnung einen Aufschlag enthält. Die Auslandsgebühr Ihrer eigenen Karte fällt in beiden Fällen an.",
      },
    ],
    labels: DE_LABELS,
  },
  {
    locale: "de",
    slug: "weverse-data-leak-what-to-do",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Das Weverse-Datenleck: was tatsächlich abgeflossen ist, und das eine Risiko daraus",
    summary:
      "422,584 Konten, von Weverse selbst bestätigt. Keine Namen, keine Kontaktdaten, keine Kartennummern — eine interne Kennung und Ihre Kaufhistorie. Diese Kombination ist kein leergeräumtes Konto; sie ist das Rohmaterial für eine Nachricht, die weiß, was Sie gekauft haben.",
    scope:
      "Behandelt, was Weverse Company zu dem im September 2026 bestätigten Leck veröffentlicht hat, gelesen in der englischen und der koreanischen Fassung der Mitteilung. Wir sind keine Sicherheitsprüfer und dies ist keine Rechtsberatung: Alles, was Weverse zugeschrieben wird, ist dessen eigene Aussage und kein von uns verifizierter Befund. Ein Sicherheitsvorfall kann sich weiterentwickeln, und diese Seite trägt das Datum unserer letzten Prüfung.",
    intro: [
      "Im September 2026 veröffentlichte der Präsident von Weverse Company eine Mitteilung, die den Abfluss personenbezogener Kundendaten bestätigte. Jede Leserin und jeder Leser dieser Seite hat ein Weverse-Konto, die Frage ist also nicht, ob das wichtig ist, sondern was sich tatsächlich ändert — und die Antwort ist enger und genauer als ein Achselzucken oder eine Panik.",
      "Es folgt diese Mitteilung, genau gelesen, in beiden Sprachen, in denen sie erschien. Nützlich ist nicht die Zahl. Nützlich ist, dass die bestimmte Datenkombination, die abgeflossen ist, zum Bestehlen fast unbrauchbar und zum Überzeugen ungewöhnlich gut geeignet ist.",
    ],
    steps: [
      {
        title: "Lesen Sie die beiden Listen, denn der Unterschied entscheidet alles",
        body: "Weverse führt das Abgeflossene unter zwei Überschriften auf. Als personenbezogene Daten: interne Identifikationsinformationen — eine eindeutige interne Nummer, die bei Ihrer Registrierung zur Nutzeridentifikation erzeugt wurde. Als allgemeine Informationen, die es nicht als personenbezogen einstuft: Kaufart im Sinne der Zahlungsmethode, Name des Zahlungsdienstleisters, Währung, Kaufbetrag, Stornobetrag, Datum und Uhrzeit des Kaufs, Kaufstatus sowie Datum und Uhrzeit der Erstattung bei stornierten Bestellungen. Der Umfang beträgt 422,584 Fälle, gezählt in Einheiten von Konto-IDs. Entscheidend ist, was auf keiner der beiden Listen steht: keine Namen, keine Kontaktdaten, keine Kartennummern oder Zahlungsdaten.",
        pitfall:
          "Die Zahl 422,584 zu lesen und den Rest aus Erinnerungen an andere Vorfälle zu ergänzen. Die Reaktion auf ein Leck von Zugangsdaten und die auf dieses sind verschieden, weshalb die Einzelaufstellung mehr wert ist als die Schlagzeile.",
        takes: "5 Minuten",
      },
      {
        title: "Wägen Sie die Beruhigung von Weverse fair ab, samt ihrer Grenze",
        body: "Weverse erklärt, die abgeflossene interne Kennung sei keine Information, die eine Person unmittelbar identifiziere, wie ein Name oder Kontaktdaten; sie sei ein Wert, der nur innerhalb der internen Systeme von Weverse Company verwendet werde und extern nicht nutzbar sei; und Zahlungsfälschung oder unbefugte Geldtransfers seien allein aus diesen Datenpunkten unwahrscheinlich. Der Form nach trägt diese Begründung — eine interne Zeilennummer ist keine Identität, und keines dieser Felder ist ein Zugangsdatum. Die ehrliche Grenze ist, dass eine interne Kennung in dem Moment identifizierend wird, in dem sie mit einem anderen Datensatz verbunden wird, der sie ebenfalls enthält, und niemand außerhalb des Unternehmens kann messen, wie wahrscheinlich das ist. Das ist das verbleibende Risiko: Verknüpfung, nicht Diebstahl.",
        pitfall:
          "Eine vernünftige Beruhigung als Garantie zu nehmen — oder als PR abzutun. Es ist eine konkrete Aussage über konkrete Felder, und sie ist genau dort am stärksten, wo sie am engsten ist.",
        takes: "5 Minuten",
      },
      {
        title: "Verstehen Sie das eigentliche Risiko: eine Nachricht, die weiß, was Sie gekauft haben",
        body: "Betrachten Sie die abgeflossenen Felder zusammen — Zahlungsmethode, Dienstleister, Währung, Betrag, Datum, Status, Erstattungsdatum. Das ist keine Ausrüstung, um Ihre Karte zu belasten. Es ist die Ausrüstung, um eine Nachricht zu schreiben, die den einzigen Test besteht, den die meisten Menschen auf eine verdächtige E-Mail anwenden: ob die Absenderseite echte Details einer echten Bestellung kennt. Eine Nachricht, die Ihren tatsächlichen Kaufbetrag zitiert, am tatsächlichen Datum, in der tatsächlichen Währung, über den tatsächlichen Zahlungsdienstleister, ist weit überzeugender als alles, was ein beliebiger Betrüger verfassen könnte.",
        pitfall:
          "„Die kennen meine Bestelldaten“ als Beweis dafür zu nehmen, dass eine Nachricht echt ist. Nach diesem Leck funktioniert dieser Test nicht mehr, und es ist der Test, den fast alle verwenden.",
        takes: "5 Minuten",
      },
      {
        title: "Wissen Sie, warum das auf einen echten Vorgang trifft",
        body: "Für dieses Publikum wiegt das schwerer als für die meisten, denn legitime Fremde verlangen von Weverse-Kundschaft bereits Geld. Weverse Shop warnt Käuferinnen und Käufer in der EU, dass sie gesonderte Zahlungsanweisungen vom örtlichen Zoll oder vom Zusteller erhalten können und dass eine Nichtzahlung die Zustellung verzögern oder verhindern kann. Die echte und die betrügerische Erfahrung sehen also inzwischen gleich aus: ein Unternehmen, zu dem Sie keine Beziehung haben, verweist auf eine Bestellung, die Sie wirklich aufgegeben haben, und verlangt eine Zahlung, bevor sich Ihr Paket bewegt. Das Leck hat diese Überschneidung nicht geschaffen, aber es hat sie geschärft.",
        pitfall:
          "Die Unklarheit durch Zahlen aufzulösen — oder durch Ignorieren. Das eine kostet Geld, das andere das Paket.",
        takes: "—",
      },
      {
        title: "Nutzen Sie eine Prüfung, die nicht davon abhängt, was die Nachricht weiß",
        body: "Der Weg hindurch besteht darin, nicht mehr die Nachricht zu bewerten, sondern ihre Behauptung. Nehmen Sie die Sendungs- oder Bestellnummer heraus, gehen Sie dann selbst zum Zusteller oder zum Weverse Shop — selbst eingetippte Adresse oder gespeichertes Lesezeichen, niemals ein Link aus der Nachricht — und sehen Sie nach, ob diese Nummer zu einer Ihrer Bestellungen gehört und ob tatsächlich etwas offen ist. Ist die Nachricht echt, stehen dieselben Angaben auch auf der anderen Seite. Ist sie es nicht, steht dort nichts, und Sie haben das erfahren, ohne irgendwo zu klicken.",
        pitfall:
          "Dem Link zu folgen, weil die Details stimmten. Dass die Details stimmen, ist jetzt der Normalzustand einer Fälschung.",
        takes: "5 Minuten je Nachricht",
      },
      {
        title: "Verwechseln Sie ein neues Passwort nicht mit der Lösung",
        body: "Der Reflex nach jedem Vorfall ist, das Passwort zu ändern, und hier adressiert das fast nichts: abgeflossen sind eine Kennung und Kaufmetadaten über eine Schnittstelle für Zahlungsinformationen, keine Anmeldedaten. Das Passwort zu wechseln kostet nichts und schadet nicht, tun Sie es also, wenn es Sie beruhigt — aber tun Sie es im Wissen, dass es Hygiene und kein Heilmittel ist, und dass Sie in Wahrheit die Prüfgewohnheit aus dem vorigen Schritt schützt. Welche Zwei-Faktor-Option Ihr Anmeldedienst auch bietet, sie zu aktivieren lohnt sich grundsätzlich, und auch das ist keine Antwort auf dieses Leck.",
        pitfall:
          "Das Passwort zu ändern, sich fertig zu fühlen und dann der nächsten Nachricht zu glauben, die Ihre Bestellung zitiert. Reflexhafte Ratschläge sind bequem und verdrängen die, die wirken.",
        takes: "10 Minuten",
      },
      {
        title: "Finden Sie über das Konto heraus, ob Sie betroffen sind, nicht über eine Anleitung",
        body: "Weverse schreibt, es habe ein gesondertes Verfahren nach den Kriterien der einschlägigen Gesetze und Vorschriften durchgeführt, um die Kundschaft zu benachrichtigen, deren Daten im Leck enthalten waren. Die Antwort liegt also in Ihrem eigenen Konto: in der dort hinterlegten E-Mail-Adresse und in Ihren Benachrichtigungen in der App. Keine Anleitung kann es Ihnen sagen, auch diese nicht, und jede dritte Partei, die zu prüfen verspricht, ob Sie im Leck waren, ist ein Grund für Misstrauen und kein Dienst.",
        pitfall:
          "Nach einem Werkzeug zu suchen, das Ihnen sagt, ob Sie betroffen sind. Bei einem Leck interner Kennungen gibt es nichts Sinnvolles, was ein solches Werkzeug prüfen könnte, und die Suche selbst ist das, worauf eine Phishing-Seite wartet.",
        takes: "10 Minuten",
      },
      {
        title: "Halten Sie fest, was das Unternehmen getan haben will und was Absicht bleibt",
        body: "Die Darstellung von Weverse zur eigenen Reaktion, in dessen Worten: Es habe die Zugriffskontrolle auf die Schnittstelle zur Verarbeitung von Zahlungsinformationen verschärft und die interne Kennung daraus entfernt, damit die Daten nicht nach außen gelangen; es habe am 4. September eine Meldung über den Sicherheitsvorfall bei der Korea Internet & Security Agency eingereicht; und es habe die betroffene Kundschaft benachrichtigt. Als Vorhaben genannt werden: eine vollständige Untersuchung aller nach außen offenen Schnittstellen, strengere Zugriffskontrolle und minimierte offengelegte Informationen, strengere Kontrolle der Bereitstellungsprozesse und eine empfindlichere Sicherheitsüberwachung. Außerdem habe man die externe Partei, die auf die Daten zugegriffen hat, zu deren Rückgabe aufgefordert und beabsichtige, rechtliche Verantwortung geltend zu machen. Halten Sie beide Kategorien auseinander: die erste Gruppe sind Aussagen über abgeschlossene Arbeiten, die niemand von außen prüfen kann, die zweite sind Absichten.",
        pitfall:
          "Eine Liste geplanter Verbesserungen als Liste bereits erfolgter Behebungen zu lesen. Die Mitteilung behauptet das nicht, und eine Zusammenfassung davon sollte es auch nicht.",
        takes: "5 Minuten",
      },
      {
        title: "Erkennen Sie die Handhabung an, im angemessenen Maß",
        body: "Der von Weverse beschriebene Ablauf ist kurz: Kontaktaufnahme durch die KISA am 3. September, nachdem eine externe meldende Person eine Schwachstelle offengelegt hatte, sofortige interne Prüfung und Notfallreaktion, eine Meldung des Vorfalls bei der KISA am 4. September, und eine öffentliche Mitteilung im Namen der Unternehmensspitze, die auflistet, was abgeflossen ist — einschließlich der Felder, die nach eigener Argumentation rechtlich keine personenbezogenen Daten sind und die aufzuzählen nicht nötig gewesen wäre. Wir haben das koreanische Original gegen die englische Fassung gelesen, und beide sagen dasselbe, was für sich ein kleines Signal ist. Nichts davon macht ein Leck ungeschehen. Aber eine Seite, die Vorfälle ausschließlich als Skandale meldet, lehrt ihre Leserschaft nichts darüber, wie kompetente Handhabung aussieht, und dies kommt ihr näher als das meiste.",
        pitfall:
          "Aus einer nüchternen Bewertung zu schließen, es sei nichts passiert. 422,584 Konten sind ein echtes Versagen, das eine zügige Offenlegung nicht aufhebt.",
        takes: "—",
      },
      {
        title: "Überlegen Sie zweimal, bevor Sie das Konto löschen, und wissen Sie, was Löschen nicht ist",
        body: "Das Konto zu löschen ist der andere Reflex, und es ist eine größere Entscheidung, als es aussieht. Weverse Shop und NOL World knüpfen beide echte Dinge an ein Konto: Bestell- und Buchungshistorie, gespeicherte Adressen, eine bezahlte Mitgliedschaft und auf der Ticketseite eine abgeschlossene Identitätsprüfung. Der entscheidende Punkt ist aber einfacher. Eine Löschung entfernt Ihre Daten künftig aus dem Dienst; sie holt keine Daten zurück, die bereits abgeflossen sind. Was in diesem Leck war, war darin, bevor Sie irgendetwas entschieden haben, und ein nachträglich geschlossenes Konto erreicht es nicht.",
        pitfall:
          "Ein Konto als Reaktion auf ein Leck zu löschen. Der Wunsch ist nachvollziehbar und es ist kein Mittel dagegen, und es kostet Sie die Historie, die Sie bräuchten, falls ein Kauf je strittig würde.",
        takes: "—",
      },
    ],
    faq: [
      {
        q: "Sind mein Name, meine Adresse oder meine Kartennummer abgeflossen?",
        a: "Nach der eigenen Aufstellung von Weverse nicht. Aufgeführt werden eine interne Identifikationsnummer sowie Kaufmetadaten — Zahlungsmethode, Name des Zahlungsdienstleisters, Währung, Kauf- und Stornobeträge, Datum und Uhrzeit des Kaufs, Kaufstatus sowie Datum und Uhrzeit der Erstattung. Namen, Kontaktdaten und Zahlungsdaten stehen nicht auf der Liste.",
      },
      {
        q: "Soll ich mein Weverse-Passwort ändern?",
        a: "Es schadet nicht, und es ist nicht die Lösung. Betroffen waren eine Kennung und Kaufmetadaten über eine Schnittstelle für Zahlungsinformationen und keine Anmeldedaten, ein neues Passwort adressiert das also nicht. Tun Sie es, wenn es Sie beruhigt, und stecken Sie die eigentliche Mühe in die unabhängige Prüfung von Zahlungsaufforderungen, denn die schützt Sie hier wirklich.",
      },
      {
        q: "Woher weiß ich, ob ich zu den 422,584 gehöre?",
        a: "Über Ihr eigenes Konto. Weverse schreibt, es habe für betroffene Kundschaft nach den einschlägigen Gesetzen ein gesondertes Benachrichtigungsverfahren durchgeführt, prüfen Sie also die im Konto hinterlegte E-Mail-Adresse und Ihre Benachrichtigungen in der App. Kein externes Werkzeug kann es Ihnen sagen, und alles, was damit wirbt, sollte als Phishing-Versuch behandelt werden.",
      },
      {
        q: "Kann damit jemand meine Karte belasten?",
        a: "Weverse schreibt, Zahlungsfälschung oder unbefugte Transfers seien allein aus diesen Punkten unwahrscheinlich, und der Form der Liste nach ist das stimmig — keines der abgeflossenen Felder ist eine Kartennummer oder ein Zugangsdatum. Das realistische Risiko ist keine direkte Belastung, sondern eine überzeugende Nachricht, die Sie dazu bringt, selbst zu zahlen.",
      },
      {
        q: "Wenn es keine personenbezogenen Daten sind, warum ist es dann wichtig?",
        a: "Weil Nützlichkeit für Angreifende und rechtliche Einordnung zwei verschiedene Fragen sind. Kaufbeträge, Daten, Zahlungsmethoden und Währungen sind genau das, was eine betrügerische Nachricht glaubwürdig macht — und wie Menschen eine verdächtige E-Mail üblicherweise beurteilen, ist die Frage, ob die Absenderseite echte Details einer echten Bestellung kennt. Für alle in diesem Leck funktioniert dieser Test nicht mehr.",
      },
      {
        q: "Soll ich mein Weverse-Konto löschen?",
        a: "Das ist eine vertretbare Entscheidung und kein Mittel dagegen. Eine Löschung stoppt die künftige Erhebung; sie holt keine bereits abgeflossenen Daten zurück, auch nichts aus diesem Leck. Sie kostet Sie außerdem Bestell- und Buchungshistorie, gespeicherte Adressen, jede bezahlte Mitgliedschaft und auf der Ticketseite eine abgeschlossene Identitätsprüfung — entscheiden Sie also danach, ob Sie den Dienst noch wollen, und nicht als Reaktion hierauf.",
      },
      {
        q: "Was hat Weverse tatsächlich getan?",
        a: "Nach eigener Darstellung: die Zugriffskontrolle auf die Schnittstelle für Zahlungsinformationen verschärft und die interne Kennung daraus entfernt, am 4. September 2026 eine Meldung über den Sicherheitsvorfall bei der KISA eingereicht und die betroffene Kundschaft benachrichtigt. Außerdem werden geplante Arbeiten aufgeführt — Prüfung aller nach außen offenen Schnittstellen, strengere Kontrolle der Bereitstellung, empfindlichere Überwachung — und es heißt, man habe von der beteiligten Partei die Rückgabe der Daten verlangt und beabsichtige, rechtliche Verantwortung geltend zu machen. Die abgeschlossenen Punkte sind dessen Aussagen und keine geprüften Befunde.",
      },
      {
        q: "Gibt es etwas Neueres als das hier?",
        a: "Nicht zum Datum oben auf dieser Seite, und das ist der Tag, an dem wir zuletzt die Mitteilungsliste des Weverse Shops gelesen haben. Ein Sicherheitsthema kann sich weiterentwickeln, diese Liste ist also die lebende Fassung — gibt es eine Folgemitteilung, steht sie dort, bevor sie hier steht.",
      },
    ],
    labels: DE_LABELS,
  },
  {
    locale: "de",
    slug: "weverse-membership-renewal-overseas",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Weverse-Mitgliedschaft aus dem Ausland verlängern",
    summary:
      "Die automatische Zahlung läuft am letzten Tag Ihrer Laufzeit zu der Uhrzeit, zu der Sie zuerst bezahlt haben, in einer Währung, die übereinstimmen muss — und scheitert sie über das Verlängerungsfenster hinaus, führt kein Weg zurück außer einem Neukauf.",
    scope:
      "Behandelt, wie Sie eine bestehende Weverse Official Membership am Laufen halten und was ein Ablauf kostet. Der erstmalige Beitritt zu einem Fanclub und die Qualifikation für einen bestimmten Vorverkauf sind eigene Fragen und stehen in der Vorverkaufs-Anleitung. Alles hier stammt aus der Mitteilung des Weverse Shops vom 3. September 2026 und den darin verlinkten Produktseiten.",
    intro: [
      "Eine Mitgliedschaft, die in der falschen Woche ausläuft, kostet Sie nicht ein Abonnement. Sie kostet Sie den Vorverkauf, denn die Berechtigung wird gegen eine Mitgliedschaft geprüft, die vor einem Stichtag aktiv war, und kein noch so schneller Neukauf danach verschiebt dieses Datum.",
      "Weverse hat am 3. September 2026 die automatische Zahlung eingeführt, die den gewöhnlichen Weg in den Ablauf beseitigt. Damit kamen allerdings vier Regeln, die sich leicht falsch machen lassen, und ein Punkt ohne Wiederkehr.",
    ],
    steps: [
      {
        title: "Finden Sie heraus, in welcher Mitgliedschaftskategorie Sie sind",
        body: "Weverse führt Mitgliedschaften in drei Kategorien — Global, Japan und USA — und sie werden getrennt verwaltet. Zahlungsmethoden, Währungen und Einstellungen zur automatischen Zahlung gelten jeweils je Kategorie, und je Kategorie lassen sich bis zu fünf Zahlungsmethoden hinterlegen, von denen eine als primär markiert wird. In welcher Kategorie Sie sind, wählen Sie nicht nebenbei; es ist der Ort, an dem Ihre Mitgliedschaft bereits liegt.",
        pitfall:
          "Die automatische Zahlung in der Kategorie einzurichten, die Sie nicht nutzen. Der Bildschirm sieht identisch aus, und die Mitgliedschaft, die sich verlängert, ist die andere.",
        takes: "5 Minuten",
      },
      {
        title: "Prüfen Sie, ob Ihre Währung von der Kategorie überhaupt angenommen wird",
        body: "Stand 3. September 2026: Eine Global Membership nimmt südkoreanische Debit- oder Kreditkarten für KRW und bei PayPal hinterlegte Karten für JPY, USD oder MXN. Eine Japan Membership nimmt Kreditkarten für JPY. Eine US Membership nimmt bei PayPal hinterlegte Karten für USD. Für eine Person im Ausland mit Global Membership und Zahlung in USD heißt das: die Karte läuft über PayPal — eine direkte Kartenoption gibt es nicht.",
        pitfall:
          "Zu erwarten, eine Visa direkt auf einer USD-Global-Membership hinterlegen zu können. Dasselbe Muster zieht sich durch den Weverse Shop, und es ist der Grund, warum eine überall sonst funktionierende Karte hier scheitern kann.",
        takes: "10 Minuten",
      },
      {
        title: "Bringen Sie die Kaufwährung mit der primären Methode in Übereinstimmung",
        body: "Weverse sagt es unmissverständlich: die beim Kauf der Mitgliedschaft verwendete Zahlungswährung muss mit der Zahlungswährung Ihrer primären Methode für die automatische Zahlung übereinstimmen. Eine Abweichung wird am Verlängerungstag nicht zu Ihren Gunsten aufgelöst — sie ist eine Verlängerung, die nicht durchgeht.",
        pitfall:
          "Eine Mitgliedschaft in einer Währung zu kaufen und später eine primäre Methode in einer anderen zu hinterlegen, was auf beiden Bildschirmen stimmig aussieht und erst an dem Tag scheitert, an dem es zählt.",
        takes: "3 Minuten",
      },
      {
        title: "Kennen Sie den genauen Moment der Verlängerung",
        body: "Die automatische Zahlung läuft am letzten Tag der aktuellen Gültigkeitsdauer, zu derselben Tageszeit, zu der Sie erstmals bezahlt haben. Diese Uhrzeit wurde auf einem koreanischen Server gesetzt, liegt für die meisten Leserinnen und Leser also irgendwo in der Nacht oder am frühen Morgen. Scheitert sie, schickt Weverse eine E-Mail und eine Push-Benachrichtigung und versucht es einmal täglich zur selben Zeit erneut, solange der Verlängerungszeitraum läuft.",
        pitfall:
          "Eine Karte, die mitten in der Laufzeit abläuft, oder eine Bank, die die Belastung blockiert, wird zu einer Benachrichtigung um vier Uhr morgens Ihrer Zeit. Der erneute Versuch erfolgt täglich, nicht stündlich — ein Tag, an dem Sie die E-Mail nicht sehen, ist ein verbrauchter Tag des Fensters.",
        takes: "2 Minuten",
      },
      {
        title: "Verstehen Sie, was das Abschalten der automatischen Zahlung nicht bewirkt",
        body: "Die automatische Zahlung abzuschalten stoppt künftige Verlängerungen. Es storniert oder erstattet nicht die Mitgliedschaft, die Sie bereits halten, und Sie nutzen sie bis zum Ende der Gültigkeitsdauer normal weiter. Stornierung und Erstattung der Mitgliedschaft selbst sind eine eigene Sache und richten sich nach der Produktseite dieser Mitgliedschaft.",
        pitfall:
          "Die automatische Zahlung abzuschalten und Geld zurückzuerwarten — und, davon getrennt: sie abzuschalten, um zu „pausieren“, während eine Tour gerüchteweise ansteht, also genau in der Woche, in der die Verlängerung am wenigsten aussetzen sollte.",
        takes: "2 Minuten",
      },
      {
        title: "Behandeln Sie das Ende des Verlängerungszeitraums als Punkt ohne Wiederkehr",
        body: "Haben Sie die automatische Zahlung abgeschaltet, können Sie sie wieder aktivieren — aber nur, solange der Verlängerungszeitraum noch läuft. Ist dieser Zeitraum vorbei, ist eine Reaktivierung nicht mehr möglich, und der einzige Weg ist ein erneuter Kauf der Mitgliedschaft. Innerhalb des Fensters gibt Weverse außerdem zwei manuelle Bedienelemente: Pay Now für die sofortige Verlängerung und Retry Now, wenn eine Zahlung über eine inzwischen korrigierte Methode gescheitert ist.",
        pitfall:
          "Abzuwarten, ob die erneuten Versuche durchgehen. Retry Now und Pay Now gibt es genau dafür, dass Sie das nicht müssen, und beide verschwinden, wenn das Fenster schließt.",
        takes: "5 Minuten",
      },
      {
        title: "Verlängern statt neu kaufen, denn der Datensatz wird übernommen",
        body: "Verlängert sich eine Mitgliedschaft über die automatische Zahlung, werden die auf der bestehenden Mitgliedschaft hinterlegten Mitgliedsangaben auf die nächste übernommen. Genau dieser Datensatz — insbesondere der darauf stehende Name — ist das, wogegen eine Berechtigungsprüfung im Vorverkauf läuft. Nach einem Ablauf eine frische Mitgliedschaft zu kaufen beginnt einen neuen Datensatz und ein neues Startdatum, und das ist der Teil, der einen Vorverkauf kostet statt einer Abogebühr.",
        pitfall:
          "Anzunehmen, es gehe bei der Kontinuität um Treue. Es geht um ein Datum und einen Namen auf einem Datensatz, und eine Lücke in einem von beidem ist das, was die Prüfung sieht.",
        takes: "2 Minuten",
      },
    ],
    faq: [
      {
        q: "Kann ich eine Global Membership mit meiner eigenen Visa oder Mastercard bezahlen?",
        a: "Außerhalb von KRW nicht direkt. Eine Global Membership nimmt koreanische Karten für KRW und bei PayPal hinterlegte Karten für JPY, USD oder MXN — Ihre Karte erreicht Weverse also über PayPal und nicht als direkte Kartenzahlung.",
      },
      {
        q: "Wann genau belastet mich die automatische Zahlung?",
        a: "Am letzten Tag der aktuellen Gültigkeitsdauer, zu derselben Tageszeit, zu der Sie erstmals bezahlt haben. Diese Zeit wurde nach koreanischer Uhr gesetzt, rechnen Sie sie also für Ihre eigene um.",
      },
      {
        q: "Wenn die automatische Zahlung scheitert, wie viele Versuche habe ich?",
        a: "Weverse benachrichtigt Sie per E-Mail und Push und versucht es dann einmal täglich zur selben Zeit erneut, für den Rest des Verlängerungszeitraums. Sie können außerdem Retry Now nutzen, nachdem Sie die Zahlungsmethode korrigiert haben, oder Pay Now, um sofort zu verlängern.",
      },
      {
        q: "Ich habe die automatische Zahlung abgeschaltet. Kann ich sie wieder einschalten?",
        a: "Ja, solange der Verlängerungszeitraum noch offen ist — dafür gibt es genau ein Bedienelement zur Reaktivierung. Nach Ende des Verlängerungszeitraums geht das nicht mehr, und die einzige Möglichkeit ist der erneute Kauf der Mitgliedschaft.",
      },
      {
        q: "Macht es etwas aus, wenn meine Mitgliedschaft ein paar Tage ausläuft?",
        a: "Es kann mehr ausmachen als der Preis. Eine Verlängerung übernimmt die Mitgliedsangaben der bestehenden Mitgliedschaft; ein Neukauf beginnt einen neuen Datensatz mit neuem Datum. Die Vorverkaufsberechtigung wird gegen diesen Datensatz und dessen Stichtag geprüft und nicht danach, wie lange Sie schon Fan sind.",
      },
    ],
    labels: DE_LABELS,
  },
  {
    locale: "zh-Hant",
    slug: "yes24-global-ticketing-guide",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "YES24 Global 購票：那些沒有寫在英文頁面上的規則",
    summary:
      "你既有的 YES24 帳號不能用。PayPal 只有在演出日期夠遠時才會出現。有兩種卡片被直接拒絕，而場館會拿你的護照比對你註冊時用的姓名。",
    scope:
      "涵蓋海外買家所使用的英文版 YES24 TICKET 網站。韓文版 YES24 網站是另一套帳號系統與另一種身分查驗。場次頁面上的個別條件優先於本頁所有內容，YES24 自己也這麼說。",
    intro: [
      "YES24 把它的海外規則公布在一份英文購買指南與 FAQ 裡，而在這個主題上排名靠前的那些指南，幾乎沒有一份寫到裡面的內容。那些規則很具體、很不尋常，而其中有幾條，如果你是在結帳當下第一次遇到，當天的訂票就會到此為止。",
      "以下全部出自那兩個頁面，於 2026 年 10 月 20 日讀取。在 YES24 自相矛盾的地方——而它確實矛盾過一次，在手續費上——本頁會直說，而不是挑一個方便的數字。",
    ],
    steps: [
      {
        title: "就算你已經有 YES24 帳號，也要重新註冊一次",
        body: "YES24 說得很直白：想使用 Global YES24 TICKET 網站的既有 YES24 會員，必須重新註冊。它也提醒，Global 售票網站與書店 global.yes24.com 是不同的東西，兩者不共用會員資料。非會員完全無法訂票，所以這是第一步，不是形式。",
        pitfall:
          "三個名稱相近、彼此不共用登入的 YES24 服務。在排隊中才發現，就是太晚發現——而且因為下面那條姓名查驗，帳號本來就必須在好幾天前就存在。",
        takes: "15 分鐘",
      },
      {
        title: "姓名要與護照上的完全一致",
        body: "這是少數幾個平台把話說白的地方。YES24 的 FAQ：如果你的 YES24 帳號姓名與護照姓名不同，你在場館領取已訂的票時可能會遇到問題。現場取票只能由持票人本人領取，而領取需要實體有效證件——護照——連同訂票紀錄。",
        pitfall:
          "漏掉的中間名、多年前選定的羅馬拼音、名在前姓在後的順序。場館是在比對兩份文件，不是在判斷那明顯就是你。",
        takes: "10 分鐘",
      },
      {
        title: "確認你那一場究竟有沒有提供 PayPal",
        body: "YES24 Global 上的 PayPal 只有在訂票日與演出日相隔超過 180 天時才可使用。對多數提前一兩個月公布的 K-POP 演唱會而言，這表示 PayPal 根本不是選項，信用卡是唯一的路。另外還有一筆 10 美分的 PayPal 手續費，即使你取消也不退還。",
        pitfall:
          "因為某份指南說接受 PayPal 就照著規劃，然後在結帳時只看到信用卡欄位。那條 180 天規則就是原因——不是錯誤，也不是客服能通融的事。",
        takes: "2 分鐘",
      },
      {
        title: "在你試刷之前，先知道哪些卡會被拒絕",
        body: "購買指南排除在韓國境外發行的 American Express 卡片，以及完全排除中國銀聯卡。其餘都以信用卡付款的方式通過——而 YES24 表示 Global 網站要求 3-D Secure 驗證，所以你的卡必須已在銀行端完成該項註冊。",
        pitfall:
          "一張在其他所有網站都能用的 Amex，在這裡因為發行地而被拒，與卡片本身無關。那種失敗看起來和銀行封鎖一模一樣，於是人們把整場開賣花在跟銀行談一個錯誤的問題上。",
        takes: "10 分鐘，與你的銀行",
      },
      {
        title: "在訂票當下就選定現場領取或海外寄送",
        body: "兩種都存在，但海外寄送是逐場次而非全面提供：YES24 表示可用與否依場次而異、費用依目的地而異，而場次頁面才是載明之處。事後變更領取方式，只能在演出前 20 個工作日之前進行——那是四個工作週，不是四天。",
        pitfall:
          "20 個工作日大約是一個月的日曆時間。在演出前兩週才訂票，意味著你在排隊中選的方式就是你要留著的方式。",
        takes: "5 分鐘",
      },
      {
        title: "讀懂訂票與取消的時鐘，那不是演出日",
        body: "訂票在週二至週六演出的前一天下午5點關閉，週日或週一演出則在星期六上午11點關閉。取消跑的是完全相同的時鐘，而期限過後就沒有取消、變更或退款。購買後 7 天內取消免費；之後是每張票的手續費，隨著演出接近升至已付金額的 10%、20% 與 30%。每人同時最多 10 張。",
        pitfall:
          "訂票手續費是 YES24 自相矛盾之處：FAQ 在一行裡寫 2,000 KRW，下一行又宣告自 2023 年 8 月 14 日起每張票改為 3,000 KRW。請以 3,000 為現行值。無論如何，它只在你購買當天的 23:59 之前可退，而不是在涵蓋門票本身的那 7 天期間內。",
        takes: "5 分鐘",
      },
      {
        title: "帶護照和訂票紀錄到場館",
        body: "領取需要實體有效證件——YES24 明確指名護照——連同訂票確認的紀錄。購買指南也要你把購買明細列印出來，在售票口交出。場次頁面上的個別政策優先於此，而 YES24 表示以場次頁面為準，所以即使你在那個場館領過票也要再讀一次。",
        pitfall:
          "手機上的確認畫面照片不是它所描述的東西。請列印出來，並攜帶你註冊時用的那本護照，而不是任何其他證件。",
        takes: "在場館",
      },
    ],
    faq: [
      {
        q: "我可以在英文網站上使用既有的 YES24 帳號嗎？",
        a: "不行。YES24 表示既有會員必須為 Global YES24 TICKET 網站重新註冊，而且它與 global.yes24.com 是分開的，不共用會員資料。",
      },
      {
        q: "為什麼結帳時沒有 PayPal？",
        a: "PayPal 只有在訂票日與演出日相隔超過 180 天時才會提供。多數演唱會的訂票都遠在那之內，所以信用卡是唯一的路。",
      },
      {
        q: "YES24 Global 拒絕哪些卡片？",
        a: "在南韓境外發行的 American Express 卡片，以及中國銀聯卡。其他卡片可以使用，但必須通過該網站所要求的 3-D Secure。",
      },
      {
        q: "可以請別人幫我領票嗎？",
        a: "不行。現場取票只能由持票人本人領取，並攜帶實體護照與訂票紀錄——除非該場演出在自己的頁面上另有說明。",
      },
      {
        q: "退款要多久？",
        a: "信用卡退款載明為 3 到 7 天，由卡片公司自身的政策決定，最長可達 30 天。PayPal 退款會在 5 個工作日內回到 PayPal 餘額——以退款當日的匯率計算並含換匯價差，所以退回的金額可能少於付出的金額。",
      },
    ],
    labels: ZH_LABELS,
  },
  {
    locale: "id",
    slug: "yes24-global-ticketing-guide",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Tiket YES24 Global: aturan yang tidak ada di halaman berbahasa Inggrisnya",
    summary:
      "Akun YES24 Anda yang sudah ada tidak akan berfungsi. PayPal hanya muncul jika konsernya masih cukup jauh. Dua jenis kartu ditolak langsung, dan venue mencocokkan paspor Anda dengan nama yang Anda pakai saat mendaftar.",
    scope:
      "Mencakup situs YES24 TICKET berbahasa Inggris yang dipakai pembeli dari luar negeri. Situs YES24 berbahasa Korea menjalankan sistem akun yang berbeda dan pemeriksaan identitas yang berbeda. Syarat per konser di halaman acara mengalahkan semua yang ada di sini, dan YES24 sendiri menyatakan itu.",
    intro: [
      "YES24 menerbitkan aturan untuk pembeli luar negeri dalam sebuah panduan pembelian dan FAQ berbahasa Inggris, dan nyaris tak satu pun isinya muncul di panduan-panduan yang menempati peringkat untuk topik ini. Aturannya spesifik, tidak biasa, dan beberapa di antaranya akan mengakhiri pemesanan Anda pada hari-H jika Anda baru menemuinya saat checkout.",
      "Semua di bawah ini berasal dari kedua halaman itu, dibaca pada 20 Oktober 2026. Di tempat YES24 bertentangan dengan dirinya sendiri — dan itu terjadi sekali, soal sebuah biaya — halaman ini mengatakannya alih-alih memilih angka yang nyaman.",
    ],
    steps: [
      {
        title: "Daftar lagi, bahkan jika Anda sudah punya akun YES24",
        body: "YES24 menyatakannya terang-terangan: anggota YES24 yang sudah ada dan ingin memakai situs Global YES24 TICKET harus mendaftar lagi. Ia juga memperingatkan bahwa situs tiket Global berbeda dari global.yes24.com, toko bukunya, dan bahwa keduanya tidak berbagi informasi anggota. Non-anggota sama sekali tidak bisa memesan, jadi ini langkah pertama dan bukan formalitas.",
        pitfall:
          "Tiga layanan YES24 dengan nama mirip dan tanpa login bersama. Menemukan ini di tengah antrean berarti menemukannya terlalu lambat — akunnya toh harus sudah ada beberapa hari sebelumnya, karena pemeriksaan nama di bawah ini.",
        takes: "15 menit",
      },
      {
        title: "Daftarkan nama persis seperti di paspor Anda",
        body: "Inilah satu tempat di mana sebuah platform mengatakan bagian yang biasanya didiamkan. FAQ YES24: jika nama akun YES24 Anda berbeda dari nama paspor Anda, Anda bisa mengalami kesulitan mengambil tiket yang sudah dipesan di venue. Tiket yang diambil di loket hanya bisa diambil oleh pemegang tiketnya, dan pengambilannya membutuhkan identitas fisik yang berlaku — sebuah paspor — bersama catatan pemesanan.",
        pitfall:
          "Nama tengah yang hilang, romanisasi yang dipilih bertahun-tahun lalu, urutan nama depan dulu. Venue sedang membandingkan dua dokumen, bukan menilai apakah itu jelas-jelas Anda.",
        takes: "10 menit",
      },
      {
        title: "Periksa apakah PayPal bahkan ditawarkan untuk konser Anda",
        body: "PayPal di YES24 Global hanya tersedia ketika jarak antara tanggal pemesanan dan tanggal konser lebih dari 180 hari. Untuk sebagian besar konser K-pop, yang diumumkan satu atau dua bulan sebelumnya, itu berarti PayPal sama sekali bukan pilihan dan kartu adalah satu-satunya rute. Ada juga biaya PayPal sebesar 10 sen yang tidak dikembalikan meski Anda membatalkan.",
        pitfall:
          "Menyusun rencana di atas PayPal karena sebuah panduan bilang ia diterima, lalu hanya menemukan kolom kartu saat checkout. Aturan 180 hari itulah sebabnya — bukan kesalahan, dan bukan sesuatu yang bisa dikesampingkan layanan pelanggan.",
        takes: "2 menit",
      },
      {
        title: "Ketahui kartu mana yang ditolak sebelum Anda mencoba satu",
        body: "Panduan pembeliannya mengecualikan kartu American Express yang diterbitkan di luar Korea, dan kartu China UnionPay sepenuhnya. Selebihnya diproses sebagai pembayaran kartu — dan YES24 menyatakan autentikasi 3-D Secure diwajibkan di situs Global, jadi kartunya harus sudah terdaftar untuk itu di bank Anda.",
        pitfall:
          "Sebuah Amex yang berfungsi di setiap situs lain ditolak di sini karena tempat ia diterbitkan, bukan karena apa pun tentang kartunya. Kegagalan itu terlihat identik dengan blokir bank, jadi orang menghabiskan waktu penjualan menelepon bank soal masalah yang keliru.",
        takes: "10 menit, bersama bank Anda",
      },
      {
        title: "Pilih pengambilan di loket atau pengiriman ke luar negeri saat memesan",
        body: "Keduanya ada, tetapi pengiriman ke luar negeri bersifat per konser alih-alih menyeluruh: YES24 menyatakan ketersediaannya berbeda menurut pertunjukan dan biayanya berbeda menurut tujuan, dan bahwa halaman acaranya adalah tempat hal itu dinyatakan. Mengubah metode penyerahan sesudahnya hanya mungkin sampai 20 hari kerja sebelum konsernya — empat pekan kerja, bukan empat hari.",
        pitfall:
          "Dua puluh hari kerja kira-kira sebulan kalender. Memesan dua pekan sebelumnya berarti metode yang Anda pilih di antrean adalah metode yang Anda pertahankan.",
        takes: "5 menit",
      },
      {
        title: "Baca jam pemesanan dan pembatalannya, yang bukan tanggal konsernya",
        body: "Pemesanan ditutup pukul 17.00 pada hari sebelum konser yang jatuh Selasa sampai Sabtu, dan pukul 11.00 pada hari Sabtu untuk konser Minggu atau Senin. Pembatalan berjalan pada jam yang persis sama, dan setelah itu lewat tidak ada pembatalan, perubahan, atau refund. Pembatalan gratis dalam 7 hari sejak pembelian; setelah itu ada biaya per tiket yang naik menjadi 10%, 20%, dan 30% dari jumlah yang dibayar seiring mendekatnya konser. Batasnya 10 tiket per orang sekaligus.",
        pitfall:
          "Biaya pemesanan adalah tempat YES24 bertentangan dengan dirinya sendiri: FAQ-nya menulis 2,000 KRW di satu baris lalu mengumumkan perubahan menjadi 3,000 KRW per tiket sejak 14 Agustus 2023 di baris berikutnya. Perlakukan 3,000 sebagai yang berlaku. Bagaimanapun ia hanya bisa direfund sampai pukul 23.59 pada hari Anda membeli, bukan dalam jendela 7 hari yang mencakup tiketnya sendiri.",
        takes: "5 menit",
      },
      {
        title: "Bawa paspor dan catatan pemesanan ke venue",
        body: "Pengambilan membutuhkan identitas fisik yang berlaku — YES24 menyebut paspor — bersama catatan konfirmasi pemesanan. Panduan pembeliannya juga meminta Anda mencetak rincian pembelian dan menyerahkannya di loket. Kebijakan per konser di halaman acara mengalahkan ini, dan YES24 menyatakan halaman acaranya yang menang, jadi bacalah bahkan jika Anda pernah mengambil tiket di venue itu sebelumnya.",
        pitfall:
          "Foto konfirmasi di ponsel bukan yang digambarkan. Cetaklah, dan bawalah paspor yang Anda pakai mendaftar alih-alih identitas lain mana pun.",
        takes: "Di venue",
      },
    ],
    faq: [
      {
        q: "Bisakah saya memakai akun YES24 saya yang sudah ada di situs berbahasa Inggris?",
        a: "Tidak. YES24 menyatakan anggota yang sudah ada harus mendaftar lagi untuk situs Global YES24 TICKET, dan bahwa situs itu terpisah dari global.yes24.com tanpa berbagi informasi anggota.",
      },
      {
        q: "Kenapa PayPal tidak ada saat checkout?",
        a: "PayPal hanya ditawarkan ketika jarak antara tanggal pemesanan dan tanggal konser lebih dari 180 hari. Sebagian besar pemesanan konser jatuh jauh di dalam jarak itu, jadi kartu adalah satu-satunya rute.",
      },
      {
        q: "Kartu mana yang ditolak YES24 Global?",
        a: "Kartu American Express yang diterbitkan di luar Korea Selatan, dan kartu China UnionPay. Kartu lain diterima tetapi harus lolos 3-D Secure, yang diwajibkan situs itu.",
      },
      {
        q: "Bisakah orang lain mengambil tiket saya?",
        a: "Tidak. Tiket di loket hanya bisa diambil oleh pemegang tiketnya, dengan paspor fisik dan catatan pemesanannya — kecuali konser tersebut menyatakan lain di halamannya sendiri.",
      },
      {
        q: "Berapa lama refund memakan waktu?",
        a: "Refund kartu dinyatakan 3 sampai 7 hari, dengan kebijakan perusahaan kartunya sendiri yang menentukan, dan hingga 30 hari. Refund PayPal kembali ke saldo PayPal dalam 5 hari kerja — pada kurs di tanggal refund termasuk selisih konversinya, jadi jumlah yang dikembalikan bisa lebih kecil daripada yang dibayar.",
      },
    ],
    labels: ID_LABELS,
  },
  {
    locale: "zh-Hant",
    slug: "weverse-membership-renewal-overseas",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "從海外續訂 Weverse 會員資格",
    summary:
      "自動付款會在你有效期間的最後一天、你第一次付款的那個時刻執行，幣別必須相符；而如果它失敗並超過續訂期間，除了重新購買之外沒有回頭路。",
    scope:
      "涵蓋如何讓既有的 Weverse Official Membership 持續有效，以及失效的代價。第一次加入後援會，以及取得某一場先行販售的資格，是另外的問題，收錄在先行販售指南中。本頁所有內容出自 Weverse Shop 2026 年 9 月 3 日的公告與其所指向的商品頁。",
    intro: [
      "在錯誤的那一週失效的會員資格，讓你失去的不是一份訂閱。它讓你失去先行販售，因為資格是對照一份在截止日之前就有效的會員資格來查驗的，而事後再怎麼重買都不會移動那個日期。",
      "Weverse 在 2026 年 9 月 3 日加入了自動付款，消除了一般意義上的失效途徑。它同時也帶來四條很容易弄錯的規則，以及一個不可逆的時點。",
    ],
    steps: [
      {
        title: "搞清楚你在哪一個會員類別",
        body: "Weverse 的會員資格分三個類別——Global、Japan 與 USA——而它們是分開管理的。付款方式、幣別與自動付款設定全都是逐類別的，每個類別最多可儲存五種付款方式，其中一種標記為主要。你屬於哪一個類別不是隨手挑的；那是你的會員資格已經所在的地方。",
        pitfall:
          "在你沒有在用的那個類別上設定自動付款。畫面看起來一模一樣，而會續訂的是另一個。",
        takes: "5 分鐘",
      },
      {
        title: "確認你的幣別是該類別真的接受的",
        body: "截至 2026 年 9 月 3 日：Global Membership 接受南韓的簽帳卡或信用卡以 KRW 付款，以及在 PayPal 登錄的卡片以 JPY、USD 或 MXN 付款。Japan Membership 接受信用卡以 JPY 付款。US Membership 接受在 PayPal 登錄的卡片以 USD 付款。對一位持 Global Membership 並以 USD 付款的海外粉絲而言，這表示卡片是透過 PayPal 走的——沒有直接刷卡的選項。",
        pitfall:
          "期待在 USD 的 Global Membership 上直接登錄一張 Visa。同樣的模式貫穿整個 Weverse Shop，這也是為什麼一張在其他地方都能用的卡在這裡仍可能失敗。",
        takes: "10 分鐘",
      },
      {
        title: "讓購買幣別與主要付款方式一致",
        body: "Weverse 說得很直接：購買會員資格時所使用的付款幣別，必須與你主要自動付款方式的付款幣別一致。不一致不會在續訂當下往對你有利的方向解決——它就是一次沒有通過的續訂。",
        pitfall:
          "用一種幣別買了會員資格，之後又加了另一種幣別的主要付款方式，在兩個畫面上看起來都沒問題，只在真正重要的那一天失敗。",
        takes: "3 分鐘",
      },
      {
        title: "知道它續訂的確切時刻",
        body: "自動付款在目前會員資格有效期間的最後一天執行，時間是你第一次付款的那個時刻。那個時刻是在韓國的伺服器上設定的，所以對多數讀者而言它落在深夜或清晨。如果失敗，Weverse 會寄出電子郵件與推播通知，並在續訂期間內每天在同一時刻重試一次。",
        pitfall:
          "一張在期間中途到期的卡，或一家擋下扣款的銀行，會變成你當地時間凌晨四點到達的一則通知。重試是每天一次，不是每小時一次——一天沒看到那封信，就是花掉了那個期間的一天。",
        takes: "2 分鐘",
      },
      {
        title: "理解取消自動付款不會做到什麼",
        body: "取消自動付款會停止未來的續訂。它不會取消或退還你已經持有的會員資格，而你會一直正常使用到有效期間結束為止。會員資格本身的取消與退款是另一回事，依該會員資格的商品頁規範。",
        pitfall:
          "取消自動付款並期待拿回錢；以及另外一種：在有巡迴傳聞時取消它來「暫停」，而那正是你最不希望續訂停止的那一週。",
        takes: "2 分鐘",
      },
      {
        title: "把續訂期間的結束當成不可逆的時點",
        body: "如果你取消了自動付款，你可以重新啟用它——但只能在續訂期間還在跑的時候。那個期間一旦結束，就無法重新啟用，唯一的路是重新購買會員資格。Weverse 也在期間內提供兩個手動控制項：Pay Now 立即續訂，以及 Retry Now，用於在你已修正付款方式後重試一次失敗的付款。",
        pitfall:
          "等著看那些重試會不會成功。Retry Now 與 Pay Now 的存在正是為了讓你不必等，而兩者都會在期間結束時消失。",
        takes: "5 分鐘",
      },
      {
        title: "續訂而不是重買，因為紀錄會延續",
        body: "當會員資格透過自動付款續訂時，登錄在既有會員資格上的會員資料會被保留到下一份上。那份紀錄——尤其是上面的姓名——正是先行販售資格查驗所對照的東西。失效之後重新購買一份新的會員資格，會開始一份新的紀錄與一個新的起始日期，而那才是讓你失去先行販售、而不只是一筆訂閱費的部分。",
        pitfall:
          "以為連續性是關於忠誠度。它關於一份紀錄上的一個日期與一個姓名，而任一者的空缺就是查驗所看到的東西。",
        takes: "2 分鐘",
      },
    ],
    faq: [
      {
        q: "我可以用自己的 Visa 或 Mastercard 支付 Global Membership 嗎？",
        a: "在 KRW 之外不能直接刷。Global Membership 接受韓國卡片以 KRW 付款，以及在 PayPal 登錄的卡片以 JPY、USD 或 MXN 付款——所以你的卡是透過 PayPal 抵達 Weverse，而不是作為一筆直接的刷卡付款。",
      },
      {
        q: "自動付款究竟在什麼時候扣我的款？",
        a: "在你目前會員資格有效期間的最後一天，時間是你第一次付款的那個時刻。那個時間是依韓國的時鐘設定的，所以請換算成你自己的。",
      },
      {
        q: "如果自動付款失敗，我有幾次機會？",
        a: "Weverse 會以電子郵件與推播通知你，然後在續訂期間剩下的時間內每天在同一時刻重試一次。你也可以在修正付款方式之後使用 Retry Now，或用 Pay Now 立即續訂。",
      },
      {
        q: "我取消了自動付款。可以再打開嗎？",
        a: "可以，只要續訂期間還開著——那裡正好有一個重新啟用的控制項。續訂期間結束之後就不行了，唯一的選項是重新購買會員資格。",
      },
      {
        q: "我的會員資格斷幾天有差嗎？",
        a: "它造成的影響可能比價格更大。續訂會保留既有會員資格的會員資料；重新購買則開始一份帶有新日期的新紀錄。先行販售資格是對照那份紀錄與它的截止日查驗的，而不是看你當粉絲當了多久。",
      },
    ],
    labels: ZH_LABELS,
  },
  {
    locale: "id",
    slug: "weverse-membership-renewal-overseas",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Memperpanjang keanggotaan Weverse dari luar negeri",
    summary:
      "Auto Payment berjalan pada hari terakhir masa berlaku Anda, pada jam yang sama saat Anda pertama kali membayar, dalam mata uang yang harus cocok — dan jika ia gagal melewati jendela perpanjangan, tidak ada jalan kembali selain membeli lagi.",
    scope:
      "Mencakup cara menjaga Weverse Official Membership yang sudah ada tetap berjalan, dan apa yang hilang kalau ia kedaluwarsa. Bergabung dengan fan club untuk pertama kali, dan memenuhi syarat untuk presale tertentu, adalah pertanyaan terpisah yang dibahas di panduan presale. Semua di sini berasal dari pemberitahuan Weverse Shop tertanggal 3 September 2026 dan halaman produk yang dirujuknya.",
    intro: [
      "Keanggotaan yang kedaluwarsa di pekan yang salah tidak membuat Anda kehilangan sebuah langganan. Ia membuat Anda kehilangan presale, karena kelayakan diperiksa terhadap keanggotaan yang aktif sebelum sebuah batas waktu, dan membeli lagi sesudahnya tidak menggeser tanggal itu sedikit pun.",
      "Weverse menambahkan Auto Payment pada 3 September 2026, yang menghapus cara biasa sebuah keanggotaan kedaluwarsa. Ia juga memperkenalkan empat aturan yang mudah dilakukan keliru, dan satu titik tanpa jalan kembali.",
    ],
    steps: [
      {
        title: "Cari tahu Anda ada di kategori keanggotaan yang mana",
        body: "Weverse menjalankan keanggotaan dalam tiga kategori — Global, Japan, dan USA — dan ketiganya dikelola terpisah. Metode pembayaran, mata uang, dan setelan Auto Payment semuanya berlaku per kategori, dan hingga lima metode pembayaran bisa disimpan untuk masing-masing dengan satu ditandai sebagai utama. Anda ada di kategori mana bukan sesuatu yang Anda pilih sembarangan; itu tempat keanggotaan Anda sudah berada.",
        pitfall:
          "Menyiapkan Auto Payment pada kategori yang tidak Anda pakai. Layarnya terlihat identik, dan keanggotaan yang diperpanjang adalah yang satunya.",
        takes: "5 menit",
      },
      {
        title: "Periksa mata uang Anda termasuk yang benar-benar diterima kategorinya",
        body: "Per 3 September 2026: Global Membership menerima kartu debit atau kredit Korea Selatan untuk KRW, dan kartu yang terdaftar di PayPal untuk JPY, USD, atau MXN. Japan Membership menerima kartu kredit untuk JPY. US Membership menerima kartu terdaftar PayPal untuk USD. Bagi fan di luar negeri dengan Global Membership yang membayar dalam USD, itu berarti kartunya berjalan lewat PayPal — tidak ada opsi kartu langsung.",
        pitfall:
          "Mengharapkan bisa mendaftarkan Visa secara langsung pada Global Membership berdenominasi USD. Pola yang sama berjalan di seluruh Weverse Shop, dan itulah sebabnya kartu yang berfungsi di mana-mana masih bisa gagal di sini.",
        takes: "10 menit",
      },
      {
        title: "Cocokkan mata uang pembelian dengan metode utamanya",
        body: "Weverse menyatakannya langsung: mata uang pembayaran yang dipakai membeli keanggotaan harus cocok dengan mata uang pembayaran metode Auto Payment utama Anda. Ketidakcocokan tidak diselesaikan pada saat perpanjangan demi keuntungan Anda — ia adalah perpanjangan yang tidak lolos.",
        pitfall:
          "Membeli keanggotaan dalam satu mata uang lalu kemudian menambahkan metode utama dalam mata uang lain, yang terlihat baik-baik saja di kedua layar dan baru gagal pada hari yang menentukan.",
        takes: "3 menit",
      },
      {
        title: "Ketahui momen persisnya ia diperpanjang",
        body: "Auto Payment berjalan pada hari terakhir masa berlaku keanggotaan saat ini, pada jam yang sama saat Anda pertama kali membayarnya. Jam itu ditetapkan di server Korea, jadi bagi sebagian besar pembaca ia jatuh di suatu titik pada malam atau dini hari. Jika gagal, Weverse mengirim surel dan notifikasi dan mencoba lagi sekali sehari pada jam yang sama, selama periode perpanjangannya masih berjalan.",
        pitfall:
          "Kartu yang kedaluwarsa di tengah masa berlaku, atau bank yang memblokir tagihannya, berubah menjadi notifikasi yang tiba pukul empat pagi waktu Anda. Percobaan ulangnya harian, bukan per jam — satu hari tidak melihat surelnya adalah satu hari jendela yang terpakai.",
        takes: "2 menit",
      },
      {
        title: "Pahami apa yang tidak dilakukan oleh pembatalan Auto Payment",
        body: "Membatalkan Auto Payment menghentikan perpanjangan di masa depan. Ia tidak membatalkan atau mengembalikan dana keanggotaan yang sudah Anda pegang, dan Anda tetap memakainya seperti biasa sampai masa berlakunya habis. Pembatalan dan refund keanggotaan itu sendiri adalah hal terpisah yang diatur oleh halaman produk keanggotaan tersebut.",
        pitfall:
          "Membatalkan Auto Payment dengan harapan uang kembali — dan, terpisah dari itu: membatalkannya untuk “menjeda” saat sebuah tur sedang dirumorkan, yaitu pekan ketika Anda paling tidak ingin perpanjangannya berhenti.",
        takes: "2 menit",
      },
      {
        title: "Perlakukan akhir periode perpanjangan sebagai titik tanpa jalan kembali",
        body: "Jika Anda membatalkan Auto Payment, Anda bisa mengaktifkannya kembali — tetapi hanya selama periode perpanjangannya masih berjalan. Begitu periode itu berakhir, pengaktifan ulang tidak tersedia dan satu-satunya rute adalah membeli keanggotaannya lagi. Weverse juga memberi dua kendali manual di dalam jendela itu: Pay Now untuk memperpanjang segera, dan Retry Now jika sebuah pembayaran gagal pada metode yang sejak itu sudah Anda perbaiki.",
        pitfall:
          "Menunggu untuk melihat apakah percobaan ulangnya berhasil. Retry Now dan Pay Now ada justru agar Anda tidak perlu menunggu, dan keduanya menghilang ketika jendelanya menutup.",
        takes: "5 menit",
      },
      {
        title: "Perpanjang alih-alih membeli ulang, karena catatannya terbawa",
        body: "Ketika sebuah keanggotaan diperpanjang lewat Auto Payment, informasi anggota yang terdaftar pada keanggotaan yang ada dipertahankan pada yang berikutnya. Catatan itu — khususnya nama di dalamnya — adalah apa yang diperiksa oleh sebuah pemeriksaan kelayakan presale. Membeli keanggotaan baru setelah kedaluwarsa memulai catatan baru dan tanggal mulai baru, dan itulah bagian yang membuat Anda kehilangan presale alih-alih sekadar biaya langganan.",
        pitfall:
          "Mengira kesinambungan itu soal kesetiaan. Ia soal sebuah tanggal dan sebuah nama pada sebuah catatan, dan celah pada salah satunya adalah yang dilihat pemeriksaan itu.",
        takes: "2 menit",
      },
    ],
    faq: [
      {
        q: "Bisakah saya membayar Global Membership dengan Visa atau Mastercard saya sendiri?",
        a: "Tidak secara langsung, di luar KRW. Global Membership menerima kartu Korea untuk KRW, dan kartu terdaftar PayPal untuk JPY, USD, atau MXN — jadi kartu Anda mencapai Weverse lewat PayPal alih-alih sebagai pembayaran kartu langsung.",
      },
      {
        q: "Kapan tepatnya Auto Payment menagih saya?",
        a: "Pada hari terakhir masa berlaku keanggotaan Anda saat ini, pada jam yang sama saat Anda pertama kali membayar. Waktu itu ditetapkan menurut jam Korea, jadi konversikan untuk jam Anda sendiri.",
      },
      {
        q: "Kalau Auto Payment gagal, berapa kesempatan yang saya punya?",
        a: "Weverse memberi tahu Anda lewat surel dan notifikasi, lalu mencoba lagi sekali sehari pada jam yang sama untuk sisa periode perpanjangannya. Anda juga bisa memakai Retry Now setelah memperbaiki metode pembayarannya, atau Pay Now untuk memperpanjang segera.",
      },
      {
        q: "Saya membatalkan Auto Payment. Bisakah saya menyalakannya lagi?",
        a: "Bisa, selama periode perpanjangannya masih terbuka — ada kendali pengaktifan ulang persis untuk itu. Setelah periode perpanjangan berakhir Anda tidak bisa, dan satu-satunya pilihan adalah membeli keanggotaannya lagi.",
      },
      {
        q: "Apakah penting kalau keanggotaan saya kedaluwarsa beberapa hari?",
        a: "Itu bisa lebih penting daripada harganya. Perpanjangan mempertahankan informasi anggota dari keanggotaan yang ada; pembelian ulang memulai catatan baru dengan tanggal baru. Kelayakan presale diperiksa terhadap catatan itu dan batas waktunya, bukan terhadap sudah berapa lama Anda menjadi fan.",
      },
    ],
    labels: ID_LABELS,
  },
  {
    locale: "zh-Hant",
    slug: "nol-world-account-recovery-and-booking-errors",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "被鎖在 NOL World 外面：找回帳號，以及修好那個打不開的頁面",
    summary:
      "你當初用哪種登入方式，決定了之後每一條找回路線；密碼重設只存在於電子郵件註冊的帳號；而一個未驗證的電子郵件，可能讓帳號根本難以被找到。另外還有那些看起來像錯誤、其實不是錯誤的訂票頁面訊息。",
    scope:
      "涵蓋帳號找回、帳號刪除，以及 NOL World 所記載的訂票頁面的失敗情況：瀏覽器與 App 的要求、行動版座位圖，以及那些看起來像故障的彈出訊息。排隊機制有自己的指南。本頁沒有任何內容能幫助任何人進入不屬於自己的帳號。",
    intro: [
      "在售票網站上有兩件事會出錯，而它們都與門票無關。你進不去帳號，或者頁面就是不肯做它該做的事——而兩者都發生在開賣當天早上，那時沒有時間讀任何東西。",
      "這幾乎全部取決於你幾個月前不假思索做出的一個選擇：你是用電子郵件註冊，還是用 Google、Apple 或 Line。單是那一件事，就決定了密碼重設對你而言存不存在，所以那是起點。",
    ],
    steps: [
      {
        title: "搞清楚你實際上是哪一種登入方式",
        body: "NOL World 的帳號可以用電子郵件建立，也可以透過社群登入建立——Google、Apple 或 Line 等。後果比聽起來更尖銳：NOL World 表示密碼找回僅供以電子郵件註冊的使用者使用。如果你用的是社群登入，就沒有 NOL World 的密碼可以重設，因為從來就沒有過。現在、在什麼都還不急的時候，先搞清楚你是哪一種。",
        pitfall:
          "因為記得自己輸入過電子郵件地址，就以為自己是電子郵件帳號。社群登入同樣會顯示你的電子郵件，而兩者的找回路線完全不同。",
        takes: "5 分鐘",
      },
      {
        title: "驗證你的電子郵件，因為這是唯一無法事後補救的一項",
        body: "NOL World 在帳號找回說明結尾的那句話，是這個領域最重要的一句：未經電子郵件驗證的帳號可能難以被找到。這裡其他每一項都是有結果的程序。這一項是一扇可能就是打不開的門——客服是在把你比對到一筆紀錄，而未驗證的電子郵件就是他們手上最強的比對依據。如果你現在是用一個還能用的帳號在讀這段，請確認上面的電子郵件已經驗證，並讓它保持已驗證。",
        pitfall:
          "註冊時因為急著趕上開賣而跳過驗證信。它在當天不花你任何成本，而它就是「可以找回的帳號」與「失去的帳號」之間的差別。",
        takes: "3 分鐘，現在就做",
      },
      {
        title: "如果是社群登入，先從服務供應商那一側找",
        body: "如果你連自己有沒有開過 NOL World 帳號都想不起來，供應商知道。NOL World 公布了去哪裡看：在 Google，進入 Google 帳戶，然後安全性，然後你與第三方應用程式和服務的連結。在 Apple，進入設定、你的名字與 Apple ID，然後登入與安全性，然後透過 Apple 登入。在 Line，進入設定，然後帳號，然後已授權的應用程式。如果 NOL World 列在那裡，帳號就存在，而你也知道哪一個供應商能打開它。",
        pitfall:
          "在登入頁面上把每個社群按鈕輪流試一遍，看哪個能進。那可能是建立了第二個帳號而不是找到第一個，於是現在有兩個——其中一個裝著你的訂單。",
        takes: "10 分鐘",
      },
      {
        title: "如果那也失敗，把客服要的五樣東西一次給齊",
        body: "NOL World 會幫你搜尋帳號，而它列出了它需要的東西：你可能用過的電子郵件地址、登入方式（Google、Line、Apple 或電子郵件）、你的暱稱，以及你所訂商品的類型連同預約編號。它也告訴你最後那一項在哪裡——預約編號在訂票當時寄出的電子憑證信件裡。請在寫信之前把這些全部收集好，因為一封缺少預約編號的請求，等於是在請他們用猜的。",
        pitfall:
          "把舊的訂票確認信當成雜物刪掉。它們裝著預約編號，而當你弄丟的正是帳號本身時，那是你能提出的最強識別資訊。",
        takes: "20 分鐘",
      },
      {
        title: "換新手機不會弄丟你的訂單——換成另一個帳號才會",
        body: "這是最常見的假警報，而 NOL World 直白地回答了：更換手機或重新登入不會抹除你的紀錄。它要你確認的是，你是不是用了一個與原本不同的帳號登入。那幾乎總是真正的原因，而社群登入就是為什麼——一支新手機會提供當下最方便的那個供應商，而點錯一個就會讓你進到一個空的、但完全有效的第二個帳號。",
        pitfall:
          "斷定訂單不見了，然後重新買一次。票在另一個帳號裡，而第二次購買是一筆真實的購買。",
        takes: "5 分鐘",
      },
      {
        title: "使用訂票頁面預期的瀏覽器，而且只用官方管道",
        body: "NOL World 表示它是依網頁標準建置的，並建議在桌機與行動裝置上使用 Google Chrome 或 Microsoft Edge。如果訂票視窗打不開，它的指示很具體：把瀏覽器更新到最新版本、清除快取，然後再試一次。App 則從 App Store 或 Google Play 更新。它也載明門票究竟能在哪裡購買——NOL World 網站 world.nol.com/ticket 與 NOL World App，除此之外沒有別的地方。",
        pitfall:
          "在一個從來就不受支援的瀏覽器上除錯，而且是從社群媒體連結開啟的 App 內嵌網頁。在你斷定網站壞了之前，先直接用 Chrome 或 Edge 打開訂票頁面。",
        takes: "15 分鐘，前一天",
      },
      {
        title: "如果座位圖在行動版網頁上不能用，改用 App",
        body: "這是一個有記載的裝置問題，不是一般性問題。NOL World 表示在某些裝置上，行動網頁環境會在你放大縮小時把瀏覽器整個放大，使得選位變得不可能——而解決路線是下載 NOL World App。它點名了目前已確認的裝置：Galaxy Fold。如果你用的是摺疊式或比例不尋常的螢幕，請在開賣前就安裝 App，而不是在七分鐘的付款視窗裡才發現這件事。",
        pitfall:
          "用雙指縮放在座位圖上找某個特定座位。在受影響的裝置上，那個手勢正是讓選位失效的動作。",
        takes: "10 分鐘，事先",
      },
      {
        title: "知道哪些彈出訊息不是故障",
        body: "有兩則訊息讀起來像錯誤，其實不是。NOL World 表示「此座位已被選擇」的彈出訊息，會在你與另一位使用者幾乎同一瞬間選了同一個座位時出現——你的連線沒有任何問題，只是有人快了一秒。它也表示可選座位會自動更新而不需要重新整理，所以一個看起來凍住的座位圖，通常是一個正在運作的座位圖。請把兩者都當成資訊，而不是需要修理的東西。",
        pitfall:
          "為了清掉一個彈出訊息而重新載入頁面。在有排隊的開賣中，那正是會讓你失去順位的那一個動作。",
        takes: "—",
      },
      {
        title: "把多分頁的建議對照反詐欺政策一起讀",
        body: "NOL World 要求每個帳號只用一台裝置，並表示同一帳號從多台裝置同時存取可能導致你的訂票受限。接著它又為同時訂票的人提供技術建議——多個分頁會造成連線衝突，建議使用完全不同的瀏覽器例如 Chrome 與 Edge，或不同的裝置。請仔細讀那一段，因為它自己的反詐欺政策把「以相同或相似的個人資料跨帳號訂票」列為不正當使用。那條建議的安全讀法是關於不同平台：在一個瀏覽器開 NOL World，在另一個開另一家售票網站。它不是允許你同時跑自己的好幾個帳號。",
        pitfall:
          "把一則關於連線衝突的技術提示當成官方認可的多帳號策略。這兩個頁面擺在一起很彆扭，而附有公開罰則的那一個是反詐欺政策。",
        takes: "5 分鐘",
      },
      {
        title: "如果你要刪除帳號，先確切知道什麼會消失、什麼會留下",
        body: "刪除不可逆，而 NOL World 逐項列出了。會被刪除的：你的帳號與個人資料、你的預約紀錄、你的行程，以及你收藏的地點清單。會被保留的：你為某個地點留下的評論與照片。在網站上，任何登入方式都可以刪除帳號。在 App 中以電子郵件登入時，路徑是 My Account、Settings、Delete Account，然後輸入密碼；社群登入則是同樣的路徑，但改以 Google、Line 或 Apple 驗證。它文件中另外兩處的內容該被放在這旁邊：刪除會抹除你的身分驗證並把它釋出給另一個帳號，而因濫用被限制的帳號根本無法刪除。",
        pitfall:
          "為了清掉某個帳號上的問題而刪除它。被限制的帳號刪不掉，而已驗證的帳號會把你的驗證一起帶走——預約紀錄會消失，評論則不會。",
        takes: "—",
      },
    ],
    faq: [
      {
        q: "我忘記密碼了。要怎麼重設？",
        a: "只有在你是以電子郵件註冊時才能重設——NOL World 表示密碼找回僅供電子郵件註冊者使用。路徑是登入畫面、Find Password、輸入註冊用的電子郵件，然後依照寄來的重設連結操作。如果你用的是 Google、Apple 或 Line，就沒有 NOL World 的密碼；你是透過該供應商登入的。",
      },
      {
        q: "我根本不知道自己用的是哪個帳號。",
        a: "先從供應商那一側查。NOL World 公布了路徑：Google 帳戶然後安全性然後你與第三方應用程式和服務的連結；Apple 的設定然後你的 Apple ID 然後登入與安全性然後透過 Apple 登入；Line 的設定然後帳號然後已授權的應用程式。如果 NOL World 出現在那裡，那就是那個帳號。",
      },
      {
        q: "以上都沒用。客服找得到嗎？",
        a: "他們會找，用你給的東西：你可能用過的電子郵件、登入方式、你的暱稱，以及你所訂商品的類型連同預約編號——NOL World 表示那些編號在訂票時寄出的電子憑證信件裡。它也警告從未經電子郵件驗證的帳號可能難以被找到，所以請把你有的全部寄過去。",
      },
      {
        q: "我換了手機，訂單不見了。",
        a: "幾乎可以確定沒有不見。NOL World 表示更換手機或重新登入不會抹除紀錄，並要你確認自己是不是用了與原本不同的帳號登入。用社群登入時這很容易不小心發生——新手機提供的是最方便的那個供應商，不一定是你當初用的那個。",
      },
      {
        q: "訂票視窗完全打不開。",
        a: "NOL World 自己的步驟：使用標準瀏覽器，它點名 Chrome 與 Edge；更新到最新版本；清除快取；再試一次。App 則從 App Store 或 Google Play 更新到最新版本。它也載明門票只能在 world.nol.com/ticket 或 NOL World App 上購買。",
      },
      {
        q: "我在手機瀏覽器上選不了座位。",
        a: "這是一個已知的裝置問題。NOL World 表示在某些裝置上放大縮小會把整個行動瀏覽器放大，使選位變得不可能，而解法是使用 NOL World App。它點名已確認的裝置是 Galaxy Fold。請在開賣之前安裝 App，而不是在開賣當中。",
      },
      {
        q: "我可以開兩個分頁來提高機率嗎？",
        a: "不行，而且 NOL World 要求每個帳號只用一台裝置——它表示同一帳號從多台裝置同時存取可能導致你的訂票受限。它關於使用不同瀏覽器的建議，是針對你確實在用兩個不同售票平台時的連線衝突，不是對同時跑自己多個帳號的背書。以相似個人資料跨帳號訂票，就在它公開的不正當使用清單上。",
      },
      {
        q: "如果我刪除帳號，我的資料會怎樣？",
        a: "NOL World 表示刪除無法復原，並列出會消失的東西：帳號與個人資料、預約紀錄、行程，以及收藏的地點。你為某個地點留下的評論與照片會被保留。它在別處也表示刪除同時會抹除你的身分驗證並把它釋出給另一個帳號，而因濫用被限制的帳號無法刪除。",
      },
    ],
    labels: ZH_LABELS,
  },
  {
    locale: "id",
    slug: "nol-world-account-recovery-and-booking-errors",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Terkunci di luar NOL World: menemukan akunnya, dan memperbaiki halaman yang tidak mau terbuka",
    summary:
      "Metode masuk yang Anda pakai menentukan setiap jalur pemulihan, pengaturan ulang kata sandi hanya ada untuk pendaftaran lewat surel, dan surel yang belum terverifikasi bisa membuat sebuah akun sulit ditemukan sama sekali. Ditambah kesalahan di halaman pemesanan yang sebenarnya bukan kesalahan.",
    scope:
      "Mencakup pemulihan akun, penghapusan akun, dan kegagalan halaman pemesanan yang didokumentasikan NOL World: syarat peramban dan aplikasi, peta kursi di seluler, dan pop-up yang terlihat seperti kerusakan. Mekanika antrean ada di panduannya sendiri. Tidak ada apa pun di sini yang membantu siapa pun masuk ke akun yang bukan miliknya.",
    intro: [
      "Ada dua hal yang salah di sebuah situs tiket yang sama sekali tidak berhubungan dengan tiket. Anda tidak bisa masuk ke akun, atau halamannya sekadar tidak mau melakukan apa yang seharusnya — dan keduanya terjadi pada pagi hari penjualan, ketika tidak ada waktu untuk membaca apa pun.",
      "Nyaris semuanya ditentukan oleh satu pilihan yang Anda buat berbulan-bulan sebelumnya tanpa berpikir: apakah Anda mendaftar dengan alamat surel atau lewat Google, Apple, atau Line. Fakta tunggal itu menentukan apakah pengaturan ulang kata sandi bahkan ada untuk Anda, jadi di situlah titik mulainya.",
    ],
    steps: [
      {
        title: "Cari tahu jenis akun masuk yang sebenarnya Anda punya",
        body: "Akun NOL World dibuat dengan alamat surel atau melalui masuk lewat layanan lain — Google, Apple, atau Line, antara lain. Akibatnya lebih tajam daripada kedengarannya: NOL World menyatakan pemulihan kata sandi hanya tersedia bagi pengguna yang mendaftar dengan alamat surel. Jika Anda memakai masuk lewat layanan lain, tidak ada kata sandi NOL World untuk diatur ulang, karena tidak pernah ada. Cari tahu Anda yang mana sekarang, selagi tidak ada yang mendesak.",
        pitfall:
          "Mengira Anda punya akun surel karena ingat pernah mengetikkan alamat surel. Masuk lewat layanan lain juga menampilkan surel Anda, dan jalur pemulihannya sepenuhnya berbeda.",
        takes: "5 menit",
      },
      {
        title: "Verifikasi surel Anda, karena inilah yang tidak bisa dibatalkan",
        body: "Kalimat penutup NOL World sendiri soal pemulihan akun adalah yang terpenting di area ini: akun yang tidak diverifikasi lewat surel bisa sulit ditemukan. Semua hal lain di sini adalah prosedur dengan sebuah hasil. Yang satu ini adalah pintu yang bisa saja tidak terbuka — layanan pelanggan sedang mencocokkan Anda dengan sebuah catatan, dan surel yang belum terverifikasi adalah pencocokan terkuat yang mereka punya. Jika Anda membaca ini dengan akun yang masih berfungsi, periksa bahwa surel padanya sudah terverifikasi dan biarkan tetap begitu.",
        pitfall:
          "Melewatkan surel verifikasi saat mendaftar karena terburu-buru mengejar sebuah penjualan. Itu tidak memakan biaya apa pun pada hari itu dan ia adalah pembeda antara akun yang bisa dipulihkan dan akun yang hilang.",
        takes: "3 menit, sekarang",
      },
      {
        title: "Untuk masuk lewat layanan lain, periksa sisi penyedianya dulu",
        body: "Jika Anda tidak ingat apakah pernah punya akun NOL World, penyedianya tahu. NOL World menerbitkan tempat mencarinya: di Google, lewat Akun Google lalu Keamanan lalu koneksi Anda ke aplikasi dan layanan pihak ketiga. Di Apple, lewat Settings, nama Anda dan Apple ID, lalu Sign-In & Security, lalu Sign in with Apple. Di Line, lewat Settings lalu akun lalu aplikasi yang diizinkan. Jika NOL World terdaftar di sana, akunnya ada dan Anda tahu penyedia mana yang membukanya.",
        pitfall:
          "Mencoba setiap tombol layanan satu per satu di halaman masuk untuk melihat mana yang berhasil. Itu bisa membuat akun kedua alih-alih menemukan yang pertama, dan sekarang ada dua — salah satunya menyimpan pemesanan Anda.",
        takes: "10 menit",
      },
      {
        title: "Kalau itu gagal, kirimkan lima hal yang diminta layanan pelanggan",
        body: "NOL World akan mencari akunnya, dan ia menyebut apa yang dibutuhkannya: alamat surel yang mungkin Anda pakai, jenis masuknya (Google, Line, Apple, atau surel), nama panggilan Anda, serta jenis produk yang Anda pesan beserta nomor pemesanannya. Ia juga memberi tahu di mana yang terakhir itu berada — nomor pemesanan ada di voucher surel yang dikirim saat Anda memesan. Kumpulkan semuanya sebelum menulis, karena permintaan tanpa nomor pemesanan adalah permintaan yang meminta mereka menebak.",
        pitfall:
          "Menghapus surel konfirmasi pemesanan lama sebagai sampah. Di dalamnya ada nomor pemesanan, yang merupakan pengenal terkuat yang bisa Anda tawarkan ketika yang hilang justru akunnya sendiri.",
        takes: "20 menit",
      },
      {
        title: "Ponsel baru tidak menghilangkan pemesanan Anda — akun yang berbeda yang menghilangkannya",
        body: "Ini kekhawatiran palsu yang paling umum dan NOL World menjawabnya terang-terangan: mengganti ponsel atau masuk lagi tidak menghapus riwayat Anda. Yang ia minta Anda periksa adalah apakah Anda masuk dengan akun yang berbeda dari yang semula Anda pakai. Itu hampir selalu penyebab sebenarnya, dan masuk lewat layanan lain adalah sebabnya — ponsel baru menawarkan penyedia yang paling praktis, dan menekan yang keliru menempatkan Anda di akun kedua yang kosong tetapi sepenuhnya sah.",
        pitfall:
          "Menyimpulkan pemesanannya hilang lalu membeli lagi. Tiketnya ada di akun yang satunya, dan pembelian kedua itu pembelian sungguhan.",
        takes: "5 menit",
      },
      {
        title: "Pakai peramban yang diharapkan halaman pemesanan, dan hanya kanal resmi",
        body: "NOL World menyatakan ia dibangun mengikuti standar web dan merekomendasikan Google Chrome atau Microsoft Edge, baik di komputer maupun di ponsel. Jika jendela pemesanan tidak mau terbuka, instruksinya spesifik: perbarui peramban ke versi terbaru, bersihkan cache, lalu coba lagi. Untuk aplikasinya, perbarui dari App Store atau Google Play. Dan ia menyatakan di mana tiket bisa dibeli sama sekali — situs NOL World di world.nol.com/ticket dan aplikasi NOL World, dan tidak di tempat lain.",
        pitfall:
          "Mencari-cari masalah di peramban yang memang tidak pernah didukung, di dalam tampilan web aplikasi yang dibuka dari tautan media sosial. Buka halaman pemesanan langsung di Chrome atau Edge sebelum Anda menyimpulkan situsnya rusak.",
        takes: "15 menit, sehari sebelumnya",
      },
      {
        title: "Kalau peta kursi tidak berfungsi di web seluler, pindah ke aplikasi",
        body: "Ada masalah perangkat yang terdokumentasi, bukan masalah umum. NOL World menyatakan bahwa pada sebagian perangkat, lingkungan web seluler memperbesar peramban ketika Anda memperbesar dan memperkecil, yang membuat pemilihan kursi mustahil — dan jalan keluarnya adalah mengunduh aplikasi NOL World. Ia menyebut perangkat yang sejauh ini terkonfirmasi: Galaxy Fold. Jika Anda memakai layar lipat atau berproporsi tidak biasa, pasang aplikasinya sebelum penjualan alih-alih menemukan hal ini di dalam jendela pembayaran tujuh menit.",
        pitfall:
          "Mencubit layar untuk memperbesar peta kursi demi mencari kursi tertentu. Pada perangkat yang terdampak, gerakan itulah yang merusak pemilihannya.",
        takes: "10 menit, di muka",
      },
      {
        title: "Ketahui pop-up mana yang bukan kerusakan",
        body: "Dua pesan terbaca seperti kesalahan dan bukan. NOL World menyatakan pop-up yang memberi tahu bahwa kursi ini sudah dipilih muncul ketika Anda memilih kursi yang sama pada waktu yang nyaris bersamaan dengan pengguna lain — tidak ada yang salah dengan sesi Anda, seseorang hanya lebih cepat sedetik. Dan ia menyatakan kursi yang tersedia diperbarui otomatis tanpa perlu disegarkan, jadi peta kursi yang terlihat membeku biasanya peta kursi yang sedang bekerja. Perlakukan keduanya sebagai informasi alih-alih sebagai sesuatu untuk diperbaiki.",
        pitfall:
          "Memuat ulang halaman untuk menghilangkan sebuah pop-up. Pada penjualan berantrean, itu satu tindakan yang memakan posisi Anda.",
        takes: "—",
      },
      {
        title: "Baca saran soal banyak tab berdampingan dengan kebijakan antipenipuannya",
        body: "NOL World meminta satu perangkat per akun, dan menyatakan akses bersamaan dari beberapa perangkat pada akun yang sama bisa membatasi pemesanan Anda. Ia lalu memberi saran teknis bagi orang yang memesan secara bersamaan — bahwa banyak tab menimbulkan konflik sesi, dan untuk memakai peramban yang sepenuhnya terpisah seperti Chrome dan Edge, atau perangkat berbeda. Baca itu dengan cermat, karena kebijakan antipenipuannya sendiri mendaftarkan pemesanan lintas akun dengan data pribadi identik atau serupa sebagai penggunaan tidak sah. Bacaan yang aman atas saran itu adalah soal platform terpisah: NOL World di satu peramban sementara situs tiket lain berjalan di peramban lain. Itu bukan izin untuk menjalankan beberapa akun Anda sendiri sekaligus.",
        pitfall:
          "Mengambil kiat soal konflik sesi sebagai strategi yang direstui untuk banyak akun. Kedua halaman itu duduk berdampingan dengan canggung, dan yang membawa sanksi tertulis adalah kebijakan antipenipuannya.",
        takes: "5 menit",
      },
      {
        title: "Kalau Anda menghapus akunnya, ketahui persis apa yang hilang dan apa yang tinggal",
        body: "Penghapusan tidak bisa dibatalkan dan NOL World merincinya. Dihapus: informasi akun dan profil Anda, riwayat pemesanan Anda, perjalanan Anda, dan daftar tempat yang Anda sukai. Dipertahankan: ulasan dan foto yang Anda tinggalkan untuk sebuah tempat. Di situs, metode masuk mana pun bisa menghapus akunnya. Di aplikasi dengan masuk lewat surel, jalurnya adalah My Account, Settings, Delete Account, lalu kata sandi Anda; dengan masuk lewat layanan lain jalurnya sama tetapi Anda memverifikasi lewat Google, Line, atau Apple. Dua hal dari bagian lain dokumentasinya layak diletakkan di samping ini: menghapus juga menghapus verifikasi identitas Anda dan membebaskannya untuk akun lain, dan akun yang dibatasi karena penyalahgunaan sama sekali tidak bisa dihapus.",
        pitfall:
          "Menghapus akun untuk membereskan masalah pada akun itu. Akun yang dibatasi tidak bisa dihapus, dan akun yang terverifikasi membawa serta verifikasi Anda — riwayat pemesanannya hilang dan ulasannya tidak.",
        takes: "—",
      },
    ],
    faq: [
      {
        q: "Saya tidak ingat kata sandi saya. Bagaimana cara mengaturnya ulang?",
        a: "Hanya jika Anda mendaftar dengan alamat surel — NOL World menyatakan pemulihan kata sandi tersedia hanya untuk pendaftaran lewat surel. Jalurnya adalah layar masuk, Find Password, masukkan surel pendaftaran, lalu ikuti tautan pengaturan ulang yang datang. Jika Anda memakai Google, Apple, atau Line, tidak ada kata sandi NOL World; Anda masuk lewat penyedianya.",
      },
      {
        q: "Saya bahkan tidak tahu akun mana yang saya pakai.",
        a: "Periksa sisi penyedianya dulu. NOL World menerbitkan jalurnya: Akun Google lalu Keamanan lalu koneksi Anda ke aplikasi dan layanan pihak ketiga; Settings Apple lalu Apple ID Anda lalu Sign-In & Security lalu Sign in with Apple; Settings Line lalu akun lalu aplikasi yang diizinkan. Jika NOL World muncul, itulah akunnya.",
      },
      {
        q: "Tidak satu pun berhasil. Apakah layanan pelanggan akan menemukannya?",
        a: "Mereka akan mencari, dengan apa yang Anda berikan: surel yang mungkin Anda pakai, jenis masuknya, nama panggilan Anda, dan jenis produk yang Anda pesan beserta nomor pemesanannya — yang menurut NOL World ada di voucher surel yang dikirim saat Anda memesan. Ia juga memperingatkan bahwa akun yang tidak pernah diverifikasi lewat surel bisa sulit ditemukan, jadi kirimkan semua yang Anda punya.",
      },
      {
        q: "Saya ganti ponsel dan pemesanan saya hilang.",
        a: "Hampir pasti tidak. NOL World menyatakan mengganti ponsel atau masuk lagi tidak menghapus riwayat, dan meminta Anda memeriksa apakah Anda masuk dengan akun yang berbeda dari yang semula. Dengan masuk lewat layanan lain itu mudah terjadi tanpa sengaja — ponsel baru menawarkan penyedia yang paling praktis, belum tentu yang Anda pakai.",
      },
      {
        q: "Jendela pemesanannya sama sekali tidak mau terbuka.",
        a: "Langkah NOL World sendiri: pakai peramban standar, dan ia menyebut Chrome dan Edge; perbarui ke versi terbaru; bersihkan cache; coba lagi. Untuk aplikasinya, perbarui ke versi terbaru dari App Store atau Google Play. Ia juga menyatakan tiket hanya bisa dibeli di world.nol.com/ticket atau di aplikasi NOL World.",
      },
      {
        q: "Saya tidak bisa memilih kursi di peramban ponsel saya.",
        a: "Ada masalah perangkat yang diketahui. NOL World menyatakan bahwa pada sebagian perangkat, memperbesar dan memperkecil memperbesar seluruh peramban seluler, yang membuat pemilihan kursi mustahil, dan bahwa jawabannya adalah memakai aplikasi NOL World. Perangkat yang ia sebut terkonfirmasi adalah Galaxy Fold. Pasang aplikasinya menjelang penjualan alih-alih saat penjualan berlangsung.",
      },
      {
        q: "Bisakah saya membuka dua tab untuk memperbesar peluang?",
        a: "Tidak, dan NOL World meminta satu perangkat per akun — ia menyatakan akses bersamaan dari beberapa perangkat pada akun yang sama bisa membatasi pemesanan Anda. Sarannya soal peramban terpisah adalah tentang konflik sesi ketika Anda benar-benar memakai dua platform tiket berbeda, bukan dukungan untuk menjalankan beberapa akun Anda sendiri. Memesan lintas akun dengan data pribadi serupa ada di daftar penggunaan tidak sah yang ia terbitkan.",
      },
      {
        q: "Apa yang terjadi pada data saya kalau saya menghapus akun?",
        a: "NOL World menyatakan penghapusan tidak bisa dibatalkan, dan mendaftar apa yang hilang: informasi akun dan profil, riwayat pemesanan, perjalanan, dan tempat yang disukai. Ulasan dan foto yang Anda tinggalkan untuk sebuah tempat dipertahankan. Di bagian lain ia menyatakan penghapusan juga menghapus verifikasi identitas Anda, membebaskannya untuk akun lain, dan bahwa akun yang dibatasi karena penyalahgunaan tidak bisa dihapus.",
      },
    ],
    labels: ID_LABELS,
  },
  {
    locale: "zh-Hant",
    slug: "weverse-shop-shipping-delays-and-cancellation",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Weverse Shop 訂單為何遲到,以及什麼時候還取消得掉",
    summary:
      "取消鍵消失的時機是狀態改變,不是某個時限;歐盟取消了150歐元的免稅門檻,美國在關稅之外又加了一套查驗制度,而韓國連假的截止時間是算到分鐘的。",
    scope:
      "依據 Weverse Shop 自己的公告,說明下單之後會發生的事:取消期限、它針對歐盟與美國提醒過的海關變動、連假與物流造成的延遲,以及你究竟是在跟誰買東西。連假日期是2026年的,明年就不對了——公告頁才是即時版本。下單本身另有專篇。",
    intro: [
      "Weverse Shop 不斷在發配送相關的公告,而幾乎沒有人會去讀,直到自己的包裹遲了。真正的答案就在那裡:哪一項海關變動適用於你、哪個連假吃掉了四天,以及你的訂單在哪一分鐘不再能取消。",
      "這篇就是把那一整串公告一次讀完。其中有兩項是真正的新規定而非季節性延遲,而其中一項正是你的錢不再能退的那一刻。",
    ],
    steps: [
      {
        title: "先知道取消期限是由狀態決定的,不是由時鐘決定",
        body: "這是出事之前最值得知道的一件事。Weverse Shop 給的取消路徑是 Weverse App、More、My Orders、Order Details、Cancel Order,並說明一旦訂單狀態變成 Shipping Soon 或 In Transit,你就無法再取消。它沒有訂出任何寬限期,也沒有「下單幾小時內」的規則。期限會一直開著,直到倉庫改動狀態為止——而熱門商品的狀態可能比你預期的更早就改掉了。",
        pitfall:
          "打算睡一覺再決定要不要留下一時衝動的預購。那個期限不是你查得到的時間,而是一個你控制不了的事件,而且它可能在你睡覺時就過去了。",
        takes: "5分鐘,立刻",
      },
      {
        title: "你在歐盟的話,150歐元的免稅額已經沒有了",
        body: "Weverse Shop 自己的公告在一般報導含糊之處講得很具體:自2026年7月1日起,歐盟修訂了低價值進口的規定,先前150歐元以下的訂單免徵關稅,該免稅已被取消,因此不論購買金額多少都要課稅。最關鍵的細節是認定基準——Weverse 說它適用於自2026年7月1日起在當地通關的貨件,看的是當地通關日而非下單日。在變動之前下的單,仍然可能被它抓到。",
        pitfall:
          "以為小額訂單便宜到不會被課稅。現在已經沒有下限了,而決定這件事的日期,是你從訂單頁上看不到的那一個。",
        takes: "10分鐘",
      },
      {
        title: "要預期海關或快遞會直接向你收錢",
        body: "Weverse Shop 說歐盟訂單可能在當地通關時產生稅費,你可能會收到當地海關或快遞另外寄來的付款指示,而未繳納這些稅費可能導致延遲或無法送達。這跟結帳時被收費是完全不同的體驗:一間你毫無往來關係的公司寄來訊息,要你為一個你已經付過錢的包裹再付一次錢。它並非預設就是詐騙——但這也正是詐騙模仿的樣子,所以請拿追蹤號碼去對自己的訂單,而不是點訊息裡的連結。",
        pitfall:
          "把海關或快遞的付款要求當成釣魚信忽略掉,讓包裹就那樣擺著。未繳款是訂單最後根本沒送到的已知途徑之一。",
        takes: "—",
      },
      {
        title: "你在美國的話,要知道那是兩項各自獨立的變動",
        body: "關稅變動佔據了所有報導,而它並不是唯一讓美國包裹變慢的原因。Weverse Shop 另外提醒,自2026年7月8日起,美國消費品安全委員會(CPSC)強制實施 eFiling 政策,對所有進口到美國的商品進行更嚴格的當地海關查驗,預計通關會比標準配送時程多花幾天。那是一套產品安全申報制度而非關稅——所以美國訂單變慢的原因,可能跟要繳多少稅完全無關。",
        pitfall:
          "把每一次美國延遲都讀成免稅門檻那件事,然後等一張永遠不會來的稅單。這兩項變動裡,一項花錢,另一項花時間。",
        takes: "5分鐘",
      },
      {
        title: "把韓國連假當成一個以分鐘計的截止時間",
        body: "Weverse Shop 會為每個韓國連假公布截止時程,而那些時間很精確。2026年中秋,韓國以外地址的下單截止是9月23日11:00 KST,快遞配送於9月28日恢復;韓國境內地址的快遞截止是9月22日11:00 KST,當天即恢復。截止後下的單,會從恢復日起依序出貨。Weverse 另加兩點提醒:截止日當天出貨的商品,仍可能因地區而在連假後才送達,而該時程來自快遞公司,可能會變動。",
        pitfall:
          "把那些日期讀成今年的。那是2026年中秋的數字,而真正能延用的是那個模式——前一兩天的11:00 KST截止,大約一週後恢復。日期本身每次都得重新查。",
        takes: "連假前下單,10分鐘",
      },
      {
        title: "如果你的地址在中國,還有第二份連假行事曆",
        body: "Weverse Shop 會為中國的連假另發公告,影響的是收件地址在中國的訂單,因為中國海關停止作業,通關也跟著停。2026年9月25日至27日的中秋節與10月1日至7日的國慶假期,它說在9月15日11:00 KST前完成付款的訂單,有可能在國慶假期期間送達,而在那之後付款的訂單,要等假期於10月8日結束後才開始出貨。請注意,算的是付款完成,而不是下單。",
        pitfall:
          "一筆付款完成時間比你以為的更晚的預購。當截止是以完款來認定時,一筆還沒付清的訂單,就是一筆落在三週空窗另一側的訂單。",
        takes: "10分鐘",
      },
      {
        title: "把貨運中斷和包裹遺失分開看",
        body: "有些延遲既不是海關也不是連假。2026年4月,Weverse Shop 通知全歐洲及部分中東國家出現配送延遲,原因是全球物流路線與海空運班期波動,影響的是2026年4月1日之後出貨且正在國際運送中的訂單。真正有用的部分是它對追蹤資訊的說明:因為改道,追蹤更新與當地抵達都可能比平常更久,而包裹仍在運送中。在已知的中斷期間追蹤停滯,是預期中的症狀,不是遺失的證據。",
        pitfall:
          "因為追蹤一週沒動就去開遺失包裹的案件。先去公告頁看看有沒有涵蓋你所在地區的現行中斷——對一個只是被改道的包裹提出申訴,會耗掉你處理真正問題時需要的時間。",
        takes: "10分鐘",
      },
      {
        title: "確認賣家到底是不是 Weverse",
        body: "Weverse Shop 在自己的頁面上說明,部分商品由個別第三方賣家提供,在這些情況下 Weverse Company 僅作為電子商務仲介,並非交易的當事人,且對這些賣家的商品資訊與交易不承擔責任。那會改變出問題時你面對的是誰——第三方商品的對造是賣家,不是 Weverse。這件事值得在你需要投訴之前就先弄清楚,而不是在投訴的過程中。",
        pitfall:
          "以為店內所有東西都有同樣的背書,只因為它們都走同一個結帳流程。那份仲介免責聲明是公開的,而它決定了誰該給你補償。",
        takes: "5分鐘",
      },
      {
        title: "自己去讀公告,因為這一頁會比大多數頁面更快過期",
        body: "上面的一切都來自 Weverse Shop 的公告頁,而那一頁才是即時版本。海關變動是耐久的;連假時程、貨運中斷與快遞截止則不是——它們每次都重發一份,舊的那份不會改動就被取代了。在連假前下單或包裹遲到時,請去讀公告清單,而不要相信任何指南上的日期,包括這一篇。這一頁頂端的日期,就是我們上次去讀的時間。",
        pitfall:
          "相信一份去年寫的指南上的截止時間。重複的是結構,不是數字。",
        takes: "5分鐘",
      },
    ],
    faq: [
      {
        q: "我還能取消訂單嗎?",
        a: "只有在狀態還允許的時候。Weverse Shop 給的路徑是 Weverse App、More、My Orders、Order Details、Cancel Order,並說明一旦狀態變成 Shipping Soon 或 In Transit,就不再能取消。它沒有公布任何寬限期,所以答案取決於訂單本身,而不是時鐘。",
      },
      {
        q: "我在歐盟,訂單被收了海關稅。這樣對嗎?",
        a: "很可能對。Weverse Shop 說自2026年7月1日起,歐盟取消了先前涵蓋150歐元以下訂單的免稅額,因此不論金額多少都要課稅,認定基準是自該日起在當地通關的貨件。它也提醒你可能收到海關或快遞另寄的付款指示,而不繳可能導致延遲或無法送達。",
      },
      {
        q: "如果沒有稅要繳,我的美國訂單為什麼還是慢?",
        a: "因為那是兩項變動。除了關稅規定之外,Weverse Shop 提醒自2026年7月8日起,美國消費品安全委員會(CPSC)強制實施 eFiling,對所有進口到美國的商品加強查驗,預計通關會多花幾天。那一項花的是時間,不是錢。",
      },
      {
        q: "我收到要我繳海關稅的訊息。那是詐騙嗎?",
        a: "它確實可能是真的——Weverse Shop 說歐盟客戶可能收到當地海關或快遞另寄的付款指示。它同時也正是詐騙模仿的樣子。請拿追蹤號碼去對自己的訂單,並自己連到快遞公司的網站,而不是點訊息裡的連結。",
      },
      {
        q: "韓國連假下單的截止時間是什麼時候?",
        a: "Weverse Shop 每個連假公布一次,精確到分鐘。2026年中秋,韓國以外地址的截止是9月23日11:00 KST,快遞配送於9月28日恢復。它提醒該時程來自快遞公司、可能變動,而截止日當天出貨的商品仍可能在連假後才送達。請查當期的那一份,不要沿用這些日期。",
      },
      {
        q: "我的追蹤資訊一週沒更新了。包裹是不是丟了?",
        a: "先去公告頁看有沒有涵蓋你所在地區的中斷。2026年4月 Weverse Shop 通知歐洲與中東延遲時說,改道意味著追蹤更新與當地抵達都會比平常更久,而包裹仍在運送中——所以在已知的中斷期間追蹤靜止,是症狀而不是問題本身。",
      },
      {
        q: "我的商品有問題。我是要找 Weverse 嗎?",
        a: "不一定。Weverse Shop 說明部分商品由個別第三方賣家販售,此時 Weverse Company 僅作為仲介、並非交易當事人,且對那些賣家的商品資訊與交易不承擔責任。在決定找誰之前,先確認你買的是哪一種商品。",
      },
      {
        q: "我不在中國,中國的連假時程會影響我嗎?",
        a: "公告說那些時程適用於收件地址在中國的訂單,因為中國海關在連假期間停止作業。如果你的地址在別處,要盯的是韓國連假的截止時間,以及任何現行的貨運中斷。",
      },
    ],
    labels: ZH_LABELS,
  },
  {
    locale: "id",
    slug: "weverse-shop-shipping-delays-and-cancellation",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Mengapa pesanan Weverse Shop Anda terlambat, dan kapan Anda masih bisa membatalkannya",
    summary:
      "Tombol pembatalan hilang karena perubahan status alih-alih karena sebuah tenggat, Uni Eropa menghapus batas bebas bea 150 euronya, Amerika Serikat menambahkan satu rezim pemeriksaan kedua di atas rezim bea, dan sebuah hari raya Korea punya batas waktu yang dihitung sampai ke menitnya.",
    scope:
      "Mencakup apa yang terjadi setelah pesanan Weverse Shop dibuat, dari pemberitahuan Weverse Shop sendiri: tenggat pembatalan, perubahan kepabeanan yang telah ia peringatkan untuk Uni Eropa dan Amerika Serikat, keterlambatan karena hari raya dan logistik, serta dari siapa sebenarnya Anda membeli. Tanggal hari rayanya adalah tanggal tahun 2026 dan akan salah tahun depan — halaman pemberitahuannya adalah versi yang hidup. Pemesanannya sendiri punya panduannya sendiri.",
    intro: [
      "Weverse Shop menerbitkan aliran pemberitahuan yang tetap soal pengiriman, dan nyaris tidak ada yang membacanya sampai sebuah paket terlambat. Di situlah jawaban yang sebenarnya tinggal: perubahan kepabeanan mana yang berlaku untuk Anda, hari raya mana yang menelan empat hari, dan menit persisnya ketika sebuah pesanan berhenti bisa dibatalkan.",
      "Inilah aliran itu, dibaca sekaligus. Dua dari hal di bawah ini adalah aturan yang benar-benar baru alih-alih keterlambatan musiman, dan salah satunya adalah saat ketika uang Anda berhenti bisa dikembalikan.",
    ],
    steps: [
      {
        title: "Ketahui bahwa jendela pembatalan menutup karena sebuah status, bukan karena jam",
        body: "Inilah fakta yang layak diketahui sebelum ada yang salah. Weverse Shop memberikan jalur pembatalan sebagai aplikasi Weverse, lalu More, lalu My Orders, lalu Order Details, lalu Cancel Order — dan menyatakan bahwa begitu status pesanan Anda berubah menjadi Shipping Soon atau In Transit, Anda tidak akan bisa membatalkan pesanan itu. Tidak ada masa tenggang yang dinyatakan dan tidak ada aturan berapa jam setelah pemesanan. Jendelanya terbuka sampai sebuah gudang mengubah sebuah status, yang bisa terjadi lebih cepat daripada yang Anda perkirakan pada rilis yang populer.",
        pitfall:
          "Memutuskan sepanjang malam apakah akan menyimpan sebuah prapesan yang impulsif. Tenggatnya bukan sebuah waktu yang bisa Anda cari — ia sebuah peristiwa yang tidak Anda kendalikan, dan ia bisa berlalu selagi Anda tidur.",
        takes: "5 menit, segera",
      },
      {
        title: "Jika Anda di Uni Eropa, pembebasan 150 euro itu sudah tidak ada",
        body: "Pemberitahuan Weverse Shop sendiri bersifat spesifik di tempat liputan umum bersifat kabur: sejak 1 Juli 2026 Uni Eropa merevisi aturannya untuk impor bernilai rendah — sebelumnya pesanan di bawah 150 euro dibebaskan dari bea masuk, dan pembebasan itu telah dihapus, sehingga bea sekarang berlaku terlepas dari jumlah pembeliannya. Rincian yang paling penting adalah dasarnya: Weverse menyatakan ini berlaku untuk kiriman yang menyelesaikan kepabeanan setempat sejak 1 Juli 2026, menurut tanggal pembebasan setempat alih-alih tanggal pemesanan. Sebuah pesanan yang dibuat sebelum perubahan itu masih bisa terjaring olehnya.",
        pitfall:
          "Menganggap pesanan kecil terlalu murah untuk dikenai bea. Tidak ada lagi batas bawahnya, dan tanggal yang memutuskannya adalah tanggal yang tidak bisa Anda lihat dari halaman pesanan.",
        takes: "10 menit",
      },
      {
        title: "Perkirakan kepabeanan, atau kurirnya, akan meminta uang langsung kepada Anda",
        body: "Weverse Shop menyatakan pesanan Uni Eropa bisa dikenai bea selama pembebasan setempat, bahwa Anda mungkin menerima instruksi pembayaran terpisah dari kepabeanan setempat atau dari kurirnya, dan bahwa kelalaian membayar bea itu bisa menunda atau menghalangi pengiriman. Itu pengalaman yang berbeda dari sebuah tagihan di kasir: sebuah pesan datang dari perusahaan yang tidak punya hubungan apa pun dengan Anda, meminta uang sebelum sebuah paket yang sudah Anda bayar mau bergerak. Secara bawaan ia bukan penipuan — tetapi ia juga persis apa yang ditiru sebuah penipuan, jadi cocokkan nomor pelacakannya dengan pesanan Anda alih-alih mengikuti tautan di dalam pesan itu.",
        pitfall:
          "Mengabaikan permintaan pembayaran dari kepabeanan atau kurir sebagai pengelabuan lalu membiarkan paketnya menganggur. Tidak membayar adalah salah satu cara terdokumentasi sebuah pesanan sekadar tidak pernah datang.",
        takes: "—",
      },
      {
        title: "Jika Anda di Amerika Serikat, ketahui bahwa ada dua perubahan terpisah, bukan satu",
        body: "Perubahan bea mendapat semua liputannya dan ia bukan satu-satunya hal yang memperlambat paket Amerika. Weverse Shop memperingatkan secara terpisah bahwa sejak 8 Juli 2026 Komisi Keamanan Produk Konsumen Amerika Serikat memberlakukan kebijakan eFiling yang bersifat wajib, yang membawa pemeriksaan kepabeanan setempat yang lebih ketat atas semua barang yang diimpor ke Amerika Serikat, dan bahwa pembebasannya diperkirakan memakan beberapa hari lebih lama daripada rentang pengiriman standar. Itu sebuah rezim pelaporan keamanan produk alih-alih sebuah tarif — jadi sebuah pesanan Amerika bisa lambat karena alasan yang tidak berhubungan sama sekali dengan berapa bea yang terutang.",
        pitfall:
          "Membaca setiap keterlambatan Amerika sebagai perubahan nilai minimum itu lalu menunggu tagihan bea yang tidak pernah datang. Satu dari dua perubahan ini memakan uang dan yang lainnya memakan hari.",
        takes: "5 menit",
      },
      {
        title: "Perlakukan hari raya Korea sebagai batas waktu yang diukur dalam menit",
        body: "Weverse Shop menerbitkan jadwal batas waktu untuk setiap hari raya Korea, dan waktunya presisi. Untuk Chuseok 2026, batas pemesanan bagi alamat di luar Korea Selatan adalah 23 September pada 11:00 KST, dengan pengiriman ekspres kembali berjalan pada 28 September; untuk alamat Korea batas kurirnya adalah 22 September pada 11:00 KST, kembali berjalan pada hari yang sama. Pesanan yang dibuat setelah batas itu dikirim berurutan dari tanggal mulai berjalan kembali. Weverse menambahkan dua catatan: barang yang dikirim pada tanggal batas itu masih bisa datang setelah hari rayanya tergantung wilayah, dan jadwalnya datang dari kurir serta bisa berubah.",
        pitfall:
          "Membaca tanggal-tanggal itu sebagai tanggal tahun ini. Itu angka Chuseok 2026, dan polanya — sebuah batas pada 11:00 KST satu atau dua hari sebelumnya, mulai berjalan kembali kira-kira seminggu setelahnya — adalah bagian yang terbawa. Tanggalnya sendiri harus dicari setiap kali.",
        takes: "10 menit sebelum pesanan hari raya",
      },
      {
        title: "Jika alamat Anda di Tiongkok, sebuah kalender hari raya kedua berlaku",
        body: "Weverse Shop menerbitkan pemberitahuan terpisah untuk hari raya Tiongkok, yang berdampak pada pesanan dengan alamat pengiriman di Tiongkok, karena kantor kepabeanan Tiongkok tutup dan pembebasannya berhenti. Untuk Festival Pertengahan Musim Gugur 2026 pada 25 sampai 27 September dan Hari Nasional dari 1 sampai 7 Oktober, ia menyatakan pesanan yang dibayar penuh sampai 15 September pada 11:00 KST kemungkinan dikirimkan selama hari raya Hari Nasional, dan pesanan yang dibayar setelah itu akan mulai dikirim begitu hari rayanya berakhir pada 8 Oktober. Perhatikan bahwa yang dihitung adalah pembayarannya selesai, bukan pesanannya dibuat.",
        pitfall:
          "Sebuah prapesan yang pembayarannya selesai lebih lambat daripada yang Anda kira. Di tempat batasnya ditentukan oleh pembayaran penuh, sebuah pesanan yang menganggur belum terbayar adalah pesanan di sisi jauh sebuah jurang tiga minggu.",
        takes: "10 menit",
      },
      {
        title: "Pisahkan sebuah gangguan pengangkutan dari sebuah paket yang hilang",
        body: "Sebagian keterlambatan bukan kepabeanan dan bukan hari raya. Pada April 2026 Weverse Shop memberitahukan keterlambatan pengiriman di seluruh Eropa dan sejumlah negara Timur Tengah terpilih, yang disebabkan oleh fluktuasi rute logistik global serta jadwal pengangkutan udara dan laut, yang berdampak pada pesanan yang dikirim setelah 1 April 2026 dan sedang dalam perjalanan internasional. Bagian yang berguna adalah apa yang ia nyatakan soal pelacakan: karena pengalihan rute, pembaruan pelacakan dan kedatangan setempat bisa memakan waktu lebih lama daripada biasanya, dan paketnya masih dalam perjalanan. Pelacakan yang sunyi selama gangguan yang diketahui adalah gejala yang diperkirakan, bukan bukti kehilangan.",
        pitfall:
          "Membuka klaim paket hilang karena pelacakannya tidak bergerak selama seminggu. Periksa dulu halaman pemberitahuan untuk gangguan yang sedang aktif yang mencakup wilayah Anda — sebuah klaim yang diajukan atas paket yang sekadar dialihkan rutenya menghabiskan waktu yang akan Anda butuhkan untuk klaim yang sungguhan.",
        takes: "10 menit",
      },
      {
        title: "Periksa apakah Weverse benar-benar penjualnya",
        body: "Weverse Shop menyatakan di halamannya sendiri bahwa sebagian produk ditawarkan oleh penjual pihak ketiga perorangan, bahwa dalam kasus itu Weverse Company bertindak semata sebagai perantara niaga elektronik dan bukan pihak dalam transaksinya, dan bahwa ia tidak memikul tanggung jawab atas informasi produk maupun atas transaksi yang dijalankan penjual tersebut. Itu mengubah dengan siapa Anda berhadapan ketika ada yang salah — untuk barang pihak ketiga, pihak lawannya adalah penjualnya, bukan Weverse. Layak dipastikan sebelum Anda perlu mengeluh alih-alih sewaktu mengeluh.",
        pitfall:
          "Menganggap semua yang ada di toko itu memikul dukungan yang sama karena semuanya duduk di belakang kasir yang sama. Penafian perantara itu diterbitkan, dan ia memutuskan siapa yang berutang ganti kepada Anda.",
        takes: "5 menit",
      },
      {
        title: "Baca sendiri pemberitahuannya, karena halaman ini akan kedaluwarsa lebih cepat daripada sebagian besar",
        body: "Semua hal di atas datang dari halaman pemberitahuan Weverse Shop, dan halaman itu adalah versi yang hidup. Perubahan kepabeanannya tahan lama; jadwal hari raya, gangguan pengangkutan dan batas waktu kurirnya tidak — semuanya diterbitkan ulang untuk setiap kesempatan dan digantikan tanpa pemberitahuan lamanya berubah. Sebelum sebuah pesanan hari raya atau ketika sebuah paket terlambat, bacalah daftar pemberitahuannya alih-alih memercayai tanggal panduan mana pun, termasuk panduan ini. Tanggal di puncak halaman ini adalah kapan kami terakhir melakukannya.",
        pitfall:
          "Memercayai sebuah batas waktu dari panduan yang ditulis tahun lalu. Yang berulang adalah strukturnya dan bukan angkanya.",
        takes: "5 menit",
      },
    ],
    faq: [
      {
        q: "Apakah saya masih bisa membatalkan pesanan saya?",
        a: "Hanya selagi statusnya mengizinkan. Jalur Weverse Shop adalah aplikasi Weverse, More, My Orders, Order Details, Cancel Order — dan ia menyatakan bahwa begitu statusnya berubah menjadi Shipping Soon atau In Transit, pembatalan tidak lagi mungkin. Tidak ada masa tenggang yang diterbitkan, jadi jawabannya tergantung pesanannya alih-alih jamnya.",
      },
      {
        q: "Saya di Uni Eropa dan pesanan saya punya tagihan kepabeanan. Apakah itu benar?",
        a: "Mungkin benar. Weverse Shop menyatakan bahwa sejak 1 Juli 2026 Uni Eropa menghapus pembebasan bea yang sebelumnya mencakup pesanan di bawah 150 euro, sehingga bea sekarang berlaku terlepas dari jumlahnya, berdasarkan kiriman yang menyelesaikan kepabeanan setempat sejak tanggal itu. Ia juga memperingatkan Anda mungkin mendapat instruksi pembayaran terpisah dari kepabeanan atau kurirnya, dan bahwa tidak membayar bisa menunda atau menghalangi pengiriman.",
      },
      {
        q: "Mengapa pesanan Amerika saya lambat kalau tidak ada bea yang harus dibayar?",
        a: "Karena ada dua perubahan. Berdampingan dengan aturan beanya, Weverse Shop memperingatkan bahwa sejak 8 Juli 2026 Komisi Keamanan Produk Konsumen Amerika Serikat memberlakukan eFiling yang wajib, yang membawa pemeriksaan lebih ketat atas semua barang yang diimpor ke Amerika Serikat, dengan pembebasannya diperkirakan memakan beberapa hari lebih lama. Yang satu itu memakan waktu alih-alih uang.",
      },
      {
        q: "Saya mendapat pesan yang meminta saya membayar kepabeanan. Apakah itu penipuan?",
        a: "Ia bisa secara sah memang nyata — Weverse Shop menyatakan pelanggan Uni Eropa bisa menerima instruksi pembayaran terpisah dari kepabeanan setempat atau dari kurirnya. Ia juga persis apa yang ditiru sebuah penipuan. Pastikan dengan mencocokkan nomor pelacakannya ke pesanan Anda sendiri dan membuka situs kurirnya sendiri alih-alih mengikuti tautan di dalam pesan itu.",
      },
      {
        q: "Apa batas waktu untuk pesanan pada hari raya Korea?",
        a: "Weverse Shop menerbitkan satu per hari raya, sampai ke menitnya. Untuk Chuseok 2026 batas bagi alamat di luar Korea adalah 23 September pada 11:00 KST, dengan pengiriman ekspres kembali berjalan 28 September. Ia memperingatkan jadwalnya datang dari kurir dan bisa berubah, dan bahwa barang yang dikirim pada hari batas itu masih bisa datang setelah hari rayanya. Carilah yang sedang berlaku alih-alih memakai ulang tanggal-tanggal ini.",
      },
      {
        q: "Pelacakan saya tidak diperbarui selama seminggu. Apakah paket saya hilang?",
        a: "Periksa dulu halaman pemberitahuan untuk sebuah gangguan yang mencakup wilayah Anda. Ketika Weverse Shop memberitahukan keterlambatan untuk Eropa dan Timur Tengah pada April 2026, ia menyatakan pengalihan rute berarti pembaruan pelacakan dan kedatangan setempat memakan waktu lebih lama daripada biasanya dan paketnya masih dalam perjalanan — jadi pelacakan yang diam selama gangguan yang diketahui adalah gejalanya alih-alih masalahnya.",
      },
      {
        q: "Ada yang salah dengan barang saya. Apakah saya berhadapan dengan Weverse?",
        a: "Tidak selalu. Weverse Shop menyatakan bahwa sebagian produk dijual oleh penjual pihak ketiga perorangan, bahwa Weverse Company lalu bertindak semata sebagai perantara dan bukan pihak dalam transaksinya, dan bahwa ia tidak memikul tanggung jawab atas informasi produk maupun transaksi penjual tersebut. Periksa jenis barang mana yang Anda beli sebelum memutuskan kepada siapa harus mendekat.",
      },
      {
        q: "Apakah jadwal hari raya Tiongkok berdampak pada saya kalau saya tidak di Tiongkok?",
        a: "Pemberitahuannya menyatakan jadwal itu berlaku untuk pesanan dengan alamat pengiriman di Tiongkok, karena kantor kepabeanan Tiongkok tutup selama hari raya. Jika alamat Anda di tempat lain, batas waktu hari raya Korea dan gangguan pengangkutan yang sedang aktif adalah yang perlu diperhatikan.",
      },
    ],
    labels: ID_LABELS,
  },
  {
    locale: "de",
    slug: "nol-world-ticketing-guide",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "NOL World Tickets: die Seite, die interpark Global war",
    summary:
      "Die Seite, die früher interpark Global hieß. Sie wurde am 1. Dezember 2025 umbenannt, die meisten Anleitungen schicken Sie noch zum alten Namen, und hier steht der aktuelle Weg Schritt für Schritt.",
    scope:
      "Behandelt die nach außen gerichtete Plattform für koreanische Veranstaltungen. Die koreanischsprachige Seite NOL Ticket ist ein eigenes Produkt mit eigenem Kontosystem und strengerer Identitätsprüfung.",
    intro: [
      "Zwei Umbenennungen fanden kurz hintereinander statt, und fast keine englischsprachige Anleitung im Netz hat eine davon aufgenommen. Yanolja Core führte seine Marken im April 2025 unter dem Namen NOL zusammen — damals wurde aus Interpark Ticket NOL Ticket. Am 1. Dezember 2025 wurde dann aus dem nach außen gerichteten interpark Global NOL World.",
      "Die praktische Folge: Anleitungen, die Sie zu „Interpark Global“ schicken, samt Screenshots der alten Oberfläche, beschreiben ein Produkt, das umbenannt und neu gestaltet wurde. Wer einer davon folgt, navigiert nach einer veralteten Karte.",
      "Diese Seite verfolgt die aktuelle. Das Datum oben ist der Tag der letzten Prüfung.",
    ],
    steps: [
      {
        title: "Beginnen Sie auf der Seite für das Ausland, nicht auf der koreanischen",
        body: "NOL World ist die Eingangstür für Fans im Ausland. Die koreanischsprachige Seite NOL Ticket führt die strengere inländische Identitätsprüfung durch und ist für Sie in der Regel nicht der richtige Weg, sofern Sie keine koreanischen Aufenthaltsdokumente besitzen. Es handelt sich um getrennte Konten — eine Registrierung auf der einen Seite verschafft Ihnen die andere nicht.",
        pitfall:
          "Suchergebnisse und alte Lesezeichen führen weiterhin zur früheren Markierung. Vergewissern Sie sich, dass Sie auf der Auslandsseite sind, bevor Sie Zeit in ein Konto investieren.",
        takes: "5 Minuten",
      },
      {
        title: "Registrieren Sie sich mit den Angaben genau wie im Pass",
        body: "Verwenden Sie Ihren rechtlichen Namen und Ihr Geburtsdatum genau so, wie sie im Pass stehen. Hat die gewünschte Veranstaltung einen Fanclub-Vorverkauf, müssen diese Angaben außerdem mit Ihrem Mitgliedschaftseintrag übereinstimmen. Beheben Sie jede Abweichung, bevor das Vorverkaufsfenster öffnet, nicht während es offen ist.",
        pitfall:
          "Einen bereits verifizierten Namen später zu ändern ist ein Support-Vorgang und kein Schalter in den Einstellungen. Machen Sie es beim ersten Mal richtig.",
        takes: "20 Minuten",
      },
      {
        title: "Erledigen Sie die Verifizierung für Auslandskunden, bevor Sie sie brauchen",
        body: "Die Verifizierung für Auslandskunden ist eine einmalige Handlung pro Konto, und NOL World gibt an, dass die verifizierten Angaben nicht erneut verwendet werden können. Verifizieren Sie auf dem Konto, mit dem Sie tatsächlich kaufen wollen — haben Sie mehrere, wandert die Verifizierung nicht zwischen ihnen. Ein Konto zu löschen hebt dessen Verifizierung zwar auf und gibt sie für ein anderes frei, doch ein wegen Missbrauchs eingeschränktes Konto lässt sich überhaupt nicht löschen. Für die Verifizierung selbst gilt keine Altersgrenze, auch wenn altersbeschränkte Veranstaltungen die Buchung dennoch ablehnen können. Die Bestätigung kommt per E-Mail, prüfen Sie also den Spam-Ordner, bevor Sie von einem Fehlschlag ausgehen.",
        pitfall:
          "Beim Bezahlschritt festzustellen, dass die Verifizierung noch aussteht, ist der klassische Weg, einen reservierten Platz zu verlieren.",
        takes: "1-3 Tage inklusive Bearbeitung",
      },
      {
        title: "Prüfen Sie die Bedingungen der einzelnen Veranstaltung auf ihrer Seite",
        body: "Platzobergrenzen pro Konto, ob eine Mitgliedschaft nötig ist, welche Ausweisanforderungen am Veranstaltungsort gelten und ob die Veranstaltung überhaupt für Käufer aus dem Ausland offen ist, wird je Veranstaltung festgelegt. Lesen Sie die Veranstaltungsseite und die offizielle Ankündigung zusammen — wo sie sich widersprechen, gilt die offizielle Ankündigung zu Ihrer Veranstaltung.",
        pitfall:
          "Manche Veranstaltungen behalten bestimmte Platzblöcke oder Verkaufsrunden inländischen Käufern vor. Das gilt je Veranstaltung und ist aus keiner allgemeinen Anleitung zu erfahren.",
        takes: "10 Minuten",
      },
      {
        title: "Bringen Sie das richtige Dokument zur Abholung mit",
        body: "Abgeholt wird an der Kasse des Veranstaltungsorts am Tag der Veranstaltung und nicht früher — NOL World gibt an, dass Tickets nicht an einem vorherigen Tag abgeholt werden können. Das Fenster öffnet eine Stunde vor Beginn, und Sie brauchen die Bestätigungsnummer zusammen mit einem Ausweis. Rechnen Sie mit einer Schlange an der Kasse selbst. Ein abgeholtes Ticket kann bei Verlust oder Diebstahl nicht neu ausgestellt werden.",
        pitfall:
          "Der Name auf der Buchung, der Name auf dem Dokument und der Name auf der Mitgliedschaft müssen alle übereinstimmen. Ein Spitzname irgendwo in dieser Kette ist ein Problem.",
        takes: "—",
      },
    ],
    faq: [
      {
        q: "Ist NOL World dasselbe wie Interpark Global?",
        a: "Es ist derselbe nach außen gerichtete Ticketdienst nach einer Umbenennung. Aus interpark Global wurde am 1. Dezember 2025 NOL World, nachdem Yanolja Core seine Marken im April 2025 unter dem Namen NOL zusammengeführt hatte, als aus Interpark Ticket NOL Ticket wurde.",
      },
      {
        q: "Warum steht in meinem alten Lesezeichen noch Interpark?",
        a: "Umbenennungen brauchen eine Weile, bis sie sich durch Suchergebnisse, Anleitungen Dritter und zwischengespeicherte Seiten durchgearbeitet haben. Navigieren Sie von der offiziellen Ankündigung zu Ihrer Veranstaltung aus und nicht von einem gespeicherten Link oder einem Blogbeitrag.",
      },
      {
        q: "Ist NOL Global dasselbe? Und NOL Korea?",
        a: "Das sind die Namen, nach denen Leute greifen, wenn sie sich halb an die Umbenennung erinnern, und sie gehören ausgesprochen, weil sie es sind, was getippt wird. Es gibt zwei Seiten: NOL World, die nach außen gerichtete, die bis zum 1. Dezember 2025 interpark Global hieß; und NOL Ticket, die koreanischsprachige, die bis April 2025 Interpark Ticket hieß. Wurden Sie zu „NOL Global“, „NOL Korea“ oder „NOL KR“ geschickt, ist die gesuchte Seite mit großer Wahrscheinlichkeit NOL World.",
      },
      {
        q: "Kann ich mein NOL Ticket Konto auf NOL World benutzen?",
        a: "Behandeln Sie sie als getrennte Konten mit getrennter Verifizierung. Gehen Sie nicht davon aus, dass eine Anmeldung oder eine abgeschlossene Verifizierung übertragen wird — prüfen Sie es auf der Seite, von der Sie tatsächlich kaufen werden.",
      },
    ],
    labels: DE_LABELS,
  },
  {
    locale: "de",
    slug: "fan-club-presale-checklist",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Fanclub-Vorverkauf: wie Sie sich qualifizieren, bevor er schließt",
    summary:
      "Die Mitgliedschaft allein ist noch kein Zugang. Zwischen beiden steht ein Verifizierungsschritt, der seine eigene Frist hat, und ihn zu verpassen ist der häufigste Weg, einen Vorverkauf zu verlieren.",
    scope:
      "Behandelt die allgemeine Form der Qualifikation für Fanclub-Vorverkäufe koreanischer Veranstaltungen. Jede Tournee legt ihre eigenen Stufen, Fristen und Bedingungen in der offiziellen Ankündigung fest, die alles Allgemeine aufhebt.",
    intro: [
      "Der Zugang zum Vorverkauf ist eine Kette aus drei Gliedern, und Fans kennen meist nur das erste. Sie kaufen die Mitgliedschaft. Dann verknüpfen und verifizieren Sie diese Mitgliedschaft gegen das Ticketkonto. Erst danach erhalten Sie die Vorverkaufsberechtigung.",
      "Jedes Glied hat seine eigene Frist, und die Verifizierungsfrist liegt regelmäßig früher, als Leute erwarten — in manchen Fällen Tage vor dem Vorverkauf selbst. Eine am Vorabend gekaufte Mitgliedschaft kann zu spät sein, obwohl sie aktiv ist.",
      "Behandeln Sie die Ankündigung als Vorgabe und diese Seite als Prüfliste.",
    ],
    steps: [
      {
        title: "Lesen Sie die Berechtigungsklausel, nicht die Überschrift",
        body: "Die Ankündigung gibt an, welches Mitgliedschaftsprodukt und welche Stufe qualifiziert und bis zu welchem Datum sie gekauft oder aktiv gewesen sein muss. Das sind zwei verschiedene Daten, und beide zählen. Schreiben Sie sie in Ihrer eigenen Zeitzone neben KST auf.",
        pitfall:
          "Eine Mitgliedschaft, die aktiv ist, aber nach der Frist gekauft wurde, qualifiziert auf manchen Tourneen nicht. „Ich habe die Mitgliedschaft“ ist nicht dasselbe wie „ich habe mich qualifiziert“.",
        takes: "10 Minuten",
      },
      {
        title: "Kaufen Sie die Mitgliedschaft deutlich vor der Frist",
        body: "Kaufen Sie im offiziellen Store der jeweiligen Künstler. Bewahren Sie die Bestellbestätigung und die Mitgliedsnummer auf. Ist die Mitgliedschaft ein physisches Set mit digitalem Code, rechnen Sie Zeit für Versand und Freischaltung des Codes ein, die nicht sofort erfolgt. Seit dem 3. September 2026 bietet Weverse Shop außerdem Auto Payment für Mitgliedschaften, die es unterstützen: Die Verlängerung wird am letzten Tag der Laufzeit über eine hinterlegte Zahlungsmethode abgebucht, sodass eine Mitgliedschaft nicht unbemerkt in genau der Woche auslaufen kann, in der eine Tournee angekündigt wird. Es wird je Mitgliedschaftskategorie eingestellt — Global, Japan und USA werden getrennt verwaltet.",
        pitfall:
          "Weiterverkaufte oder geschenkte Mitgliedschaftscodes scheitern häufig an der Verifizierung, weil der eingetragene Name nicht zu Ihrem Ticketkonto passt. Auto Payment nimmt das Risiko des Auslaufens, nicht das Risiko beim Namen: Es verlängert genau das Konto, an dem es hängt.",
        takes: "30 Minuten",
      },
      {
        title: "Verknüpfen und verifizieren Sie die Mitgliedschaft auf der Ticketplattform",
        body: "Das ist der Schritt, den Leute überspringen. Auf der Ticketplattform gibt es eine eigene Handlung, um Ihren Fanclub-Status zu verifizieren, und sie öffnet in einem Fenster — üblicherweise einige Tage vor dem Vorverkauf — und schließt vor ihm. Tun Sie es in der Stunde, in der es öffnet.",
        pitfall:
          "Die Verifizierung für einen koreanischsprachigen Verkauf und für einen globalen Verkauf kann bei derselben Veranstaltung getrennt behandelt werden. Eine abzuschließen gewährt nicht zwangsläufig die andere.",
        takes: "20 Minuten, innerhalb des Fensters",
      },
      {
        title: "Machen Sie die drei Namen identisch",
        body: "Pass, Fanclub-Mitgliedschaft und Ticketkonto. Alle drei. Derselbe rechtliche Name, dasselbe Geburtsdatum, dieselbe Reihenfolge. Ist einer falsch, korrigieren Sie ihn vor dem Verifizierungsfenster und nicht danach.",
        pitfall:
          "Das ist die häufigste dokumentierte Ursache dafür, dass eine Vorverkaufsberechtigung nicht greift, und es ist unsichtbar bis zu dem Moment, in dem es zählt.",
        takes: "15 Minuten",
      },
      {
        title: "Bestätigen Sie, dass die Berechtigung angekommen ist",
        body: "Suchen Sie nach dem Verifizieren nach einer ausdrücklichen Bestätigung — einem Abzeichen, einer Statuszeile, einer E-Mail. Finden Sie keine positive Bestätigung Ihrer Berechtigung, gehen Sie davon aus, dass Sie sie nicht haben, und wenden Sie sich an den Support, solange das Fenster noch offen ist.",
        pitfall:
          "Schweigen ist kein Erfolg. Ein abgeschicktes Formular ist keine erteilte Berechtigung.",
        takes: "10 Minuten",
      },
    ],
    faq: [
      {
        q: "Garantiert der Kauf einer Mitgliedschaft den Zugang zum Vorverkauf?",
        a: "Nein. Auf den meisten Tourneen gibt es einen eigenen Verifizierungsschritt, der die Mitgliedschaft mit Ihrem Ticketkonto verknüpft, mit einem eigenen Fenster, das vor dem Vorverkauf öffnet und schließt. Die Mitgliedschaft ist eine Voraussetzung und nicht die Berechtigung selbst.",
      },
      {
        q: "Kann ich die Mitgliedschaft einer anderen Person nutzen?",
        a: "In der Praxis nein, denn die Verifizierung prüft den eingetragenen Namen und das Geburtsdatum gegen Ihr Ticketkonto und Ihr Ausweisdokument. Es funktioniert nicht und riskiert darüber hinaus die Stornierung der Buchung.",
      },
      {
        q: "Wie viel früher öffnet der Vorverkauf gegenüber dem allgemeinen Verkauf?",
        a: "Das hängt von der Tournee ab. Ein Tag oder mehr Vorlauf ist üblich, und die Frist für die Mitgliedschaft liegt noch früher. Die offizielle Ankündigung zu Ihrer Veranstaltung ist die einzige verlässliche Quelle.",
      },
    ],
    labels: DE_LABELS,
  },
  {
    locale: "es",
    slug: "weverse-shop-shipping-delays-and-cancellation",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Por qué tu pedido de Weverse Shop llega tarde, y cuándo todavía puedes cancelarlo",
    summary:
      "El botón de cancelar desaparece por un cambio de estado y no por un plazo, la Unión Europea eliminó su exención de 150 euros, Estados Unidos añadió un segundo régimen de inspección encima del de aranceles, y un periodo festivo coreano tiene una fecha límite medida al minuto.",
    scope:
      "Cubre lo que pasa después de hacer un pedido en Weverse Shop, a partir de los avisos de Weverse Shop: el plazo de cancelación, los cambios aduaneros que ha advertido para la UE y Estados Unidos, los retrasos por periodos festivos y logística, y a quién le estás comprando en realidad. Las fechas festivas son las de 2026 y el año que viene serán otras: la página de avisos es la versión viva. Hacer el pedido tiene su propia guía.",
    intro: [
      "Weverse Shop publica un flujo constante de avisos sobre envíos, y casi nadie los lee hasta que un paquete llega tarde. Ahí están las respuestas de verdad: qué cambio aduanero te afecta, qué periodo festivo se comió cuatro días, y el minuto exacto en que tu pedido dejó de poder cancelarse.",
      "Esto es ese flujo, leído de una vez. Dos de los puntos de abajo son reglas realmente nuevas y no retrasos de temporada, y uno de ellos es el momento en que tu dinero deja de ser reembolsable.",
      "Un detalle que importa si lees en español: Weverse Shop tiene tienda en español, pero su traducción no es completa. El aviso de Chuseok está en español y los dos avisos aduaneros — el de la UE y el de Estados Unidos — se sirven en inglés incluso en la tienda en español. Son precisamente los dos que cuestan dinero.",
    ],
    steps: [
      {
        title: "Entiende que el plazo de cancelación lo cierra un estado, no un reloj",
        body: "Este es el dato que conviene saber antes de que algo vaya mal. Weverse Shop indica la ruta de cancelación como la aplicación Weverse, luego More, luego My Orders, luego Order Details, luego Cancel Order, y advierte que una vez que el estado de tu pedido cambia a Shipping Soon o In Transit ya no podrás cancelarlo. No hay ningún periodo de gracia declarado ni ninguna regla de tantas horas después de comprar. El plazo sigue abierto hasta que un almacén cambia un estado, y eso puede pasar antes de lo que esperas en un lanzamiento con mucha demanda.",
        pitfall:
          "Dejar para mañana la decisión de quedarte con un pedido anticipado impulsivo. El plazo no es una hora que puedas consultar: es un suceso que no controlas, y puede pasar mientras duermes.",
        takes: "5 minutos, de inmediato",
      },
      {
        title: "Si estás en la Unión Europea, la exención de 150 euros ya no existe",
        body: "El aviso de Weverse Shop es concreto donde la cobertura general es vaga: desde el 1 de julio de 2026 la Unión Europea revisó sus normas para importaciones de bajo valor. Antes los pedidos por debajo de 150 euros estaban exentos de derechos de aduana, y esa exención se ha eliminado, así que los derechos se aplican ahora sea cual sea el importe de la compra. El detalle que más pesa es el criterio: Weverse dice que se aplica a los envíos que pasen la aduana local desde el 1 de julio de 2026, por fecha de despacho aduanero local y no por fecha del pedido. Un pedido hecho antes del cambio todavía puede quedar atrapado por él.",
        pitfall:
          "Dar por hecho que un pedido pequeño es demasiado barato para pagar aduana. Ya no hay suelo, y la fecha que lo decide no se ve desde la página del pedido.",
        takes: "10 minutos",
      },
      {
        title: "Cuenta con que la aduana, o la empresa de mensajería, te pida dinero directamente",
        body: "Weverse Shop dice que los pedidos a la UE pueden generar derechos de aduana durante el despacho local, que puedes recibir instrucciones de pago aparte de la aduana local o de la empresa de mensajería, y que no pagar esos derechos puede retrasar la entrega o impedirla. Es una experiencia distinta de un cargo en la caja: te llega un mensaje de una empresa con la que no tienes ninguna relación, pidiéndote dinero antes de que un paquete que ya pagaste se mueva. No es una estafa por defecto, pero es exactamente lo que imita una estafa, así que comprueba el número de seguimiento contra tu pedido en lugar de seguir el enlace del mensaje.",
        pitfall:
          "Ignorar una petición de pago de la aduana o de la mensajería como si fuera phishing y dejar el paquete parado. No pagar es una de las formas documentadas de que un pedido simplemente nunca llegue.",
        takes: "—",
      },
      {
        title: "Si estás en Estados Unidos, son dos cambios distintos y no uno",
        body: "El cambio de aranceles se lleva toda la cobertura y no es lo único que frena los paquetes a Estados Unidos. Weverse Shop advierte por separado que desde el 8 de julio de 2026 la Comisión de Seguridad de Productos de Consumo de Estados Unidos (CPSC) aplica una política obligatoria de eFiling, lo que supone inspecciones aduaneras locales más estrictas sobre todas las mercancías importadas a Estados Unidos, y que el despacho tardará previsiblemente algunos días más que el plazo de entrega estándar. Es un régimen de declaración de seguridad del producto y no un arancel, así que un pedido a Estados Unidos puede ir lento por un motivo que no tiene nada que ver con cuántos derechos se deben.",
        pitfall:
          "Leer cada retraso estadounidense como el cambio del mínimo exento y esperar una factura de aduana que no va a llegar. De estos dos cambios, uno cuesta dinero y el otro cuesta días.",
        takes: "5 minutos",
      },
      {
        title: "Trata un periodo festivo coreano como una fecha límite medida en minutos",
        body: "Weverse Shop publica un calendario de fechas límite para cada periodo festivo coreano, y las horas son exactas. Para el Chuseok de 2026, el cierre de recepción para direcciones fuera de Corea fue el 23 de septiembre a las 11:00 a. m. (KST), con reanudación del servicio exprés el 28 de septiembre; para direcciones en Corea, el cierre de recepción de mensajería fue el 22 de septiembre a las 11:00 a. m. (KST), con reanudación ese mismo día. Los pedidos hechos después del cierre se despachan por orden a partir de la fecha de reanudación. Weverse añade dos advertencias: según la región, los productos despachados en la fecha límite pueden recibirse una vez terminado el periodo festivo, y el calendario viene de la empresa de mensajería y puede cambiar.",
        pitfall:
          "Leer esas fechas como si fueran de este año. Son las cifras del Chuseok de 2026, y lo que se mantiene es el patrón: un cierre a las 11:00 a. m. (KST) uno o dos días antes, y reanudación aproximadamente una semana después. Las fechas en sí hay que consultarlas cada vez.",
        takes: "10 minutos antes de un pedido en periodo festivo",
      },
      {
        title: "Si tu dirección está en China, se aplica un segundo calendario festivo",
        body: "Weverse Shop publica avisos aparte para los periodos festivos chinos, que afectan a los pedidos con dirección de envío en China, porque las aduanas chinas cierran y el despacho se detiene. Para el Festival del Medio Otoño de 2026, del 25 al 27 de septiembre, y la Fiesta Nacional, del 1 al 7 de octubre, dijo que los pedidos pagados por completo hasta el 15 de septiembre a las 11:00 a. m. (KST) probablemente se entregarían durante la Fiesta Nacional, y que los pagados después empezarían a despacharse cuando terminara el periodo festivo, el 8 de octubre. Fíjate en que lo que cuenta es que el pago esté completo, no que el pedido esté hecho.",
        pitfall:
          "Un pedido anticipado cuyo pago se completa más tarde de lo que crees. Cuando la fecha límite se define por el pago completo, un pedido sin pagar es un pedido al otro lado de un hueco de tres semanas.",
        takes: "10 minutos",
      },
      {
        title: "Separa una interrupción del transporte de un paquete perdido",
        body: "Algunos retrasos no son aduana ni periodo festivo. En abril de 2026 Weverse Shop avisó de retrasos en las entregas en toda Europa y en algunos países de Oriente Medio, provocados por fluctuaciones en las rutas logísticas mundiales y en los horarios del transporte aéreo y marítimo, que afectaban a los pedidos despachados después del 1 de abril de 2026 y en tránsito internacional. La parte útil es lo que dice sobre el seguimiento: por los desvíos de ruta, las actualizaciones del seguimiento y las llegadas locales pueden tardar más de lo habitual, y el paquete sigue en tránsito. Un seguimiento callado durante una interrupción conocida es el síntoma previsible y no una prueba de pérdida.",
        pitfall:
          "Abrir una reclamación por paquete perdido porque el seguimiento no se mueve desde hace una semana. Mira primero la página de avisos por si hay una interrupción activa que cubra tu región: una reclamación por un paquete que solo va desviado te gasta el tiempo que necesitarías para una de verdad.",
        takes: "10 minutos",
      },
      {
        title: "Comprueba si Weverse es realmente quien vende",
        body: "Weverse Shop indica en sus propias páginas que algunos productos los ofrecen vendedores externos individuales, que en esos casos Weverse Company actúa únicamente como intermediario de comercio electrónico y no es parte de la transacción, y que no asume responsabilidad por la información del producto ni por las transacciones de esos vendedores. Eso cambia con quién tratas cuando algo va mal: en un artículo de un tercero, la contraparte es el vendedor y no Weverse. Conviene averiguarlo antes de necesitar reclamar y no mientras reclamas.",
        pitfall:
          "Suponer que todo lo de la tienda tiene el mismo respaldo porque todo pasa por la misma caja. La exención de responsabilidad del intermediario está publicada, y decide quién te debe una solución.",
        takes: "5 minutos",
      },
      {
        title: "Lee los avisos tú mismo, porque esta página caducará más rápido que la mayoría",
        body: "Todo lo anterior sale de la página de avisos de Weverse Shop, y esa página es la versión viva. Los cambios aduaneros son duraderos; los calendarios festivos, las interrupciones del transporte y los cierres de recepción no lo son: se vuelven a publicar en cada ocasión y quedan sustituidos sin que el aviso antiguo cambie. Antes de un pedido en periodo festivo o cuando un paquete llega tarde, lee la lista de avisos en lugar de fiarte de las fechas de cualquier guía, esta incluida. La fecha de arriba es cuándo lo hicimos nosotros por última vez.",
        pitfall:
          "Fiarte de una fecha límite sacada de una guía escrita el año pasado. Lo que se repite es la estructura y no las cifras.",
        takes: "5 minutos",
      },
    ],
    faq: [
      {
        q: "¿Todavía puedo cancelar mi pedido?",
        a: "Solo mientras el estado lo permita. La ruta de Weverse Shop es la aplicación Weverse, More, My Orders, Order Details, Cancel Order, y advierte que una vez que el estado cambia a Shipping Soon o In Transit la cancelación ya no es posible. No hay ningún periodo de gracia publicado, así que la respuesta depende del pedido y no del reloj.",
      },
      {
        q: "Estoy en la Unión Europea y mi pedido tiene una factura de aduana. ¿Es correcto?",
        a: "Probablemente sí. Weverse Shop dice que desde el 1 de julio de 2026 la UE eliminó la exención de derechos que antes cubría los pedidos por debajo de 150 euros, así que los derechos se aplican sea cual sea el importe, según los envíos que pasen la aduana local desde esa fecha. También advierte de que puedes recibir instrucciones de pago aparte de la aduana o de la mensajería, y de que no pagar puede retrasar la entrega o impedirla.",
      },
      {
        q: "¿Por qué va lento mi pedido a Estados Unidos si no hay aduana que pagar?",
        a: "Porque son dos cambios. Además de las normas de aranceles, Weverse Shop advierte de que desde el 8 de julio de 2026 la CPSC estadounidense aplica eFiling obligatorio, lo que supone inspecciones más estrictas sobre todas las mercancías importadas a Estados Unidos, con un despacho que previsiblemente tardará algunos días más. Ese cuesta tiempo en lugar de dinero.",
      },
      {
        q: "Me ha llegado un mensaje pidiéndome pagar la aduana. ¿Es una estafa?",
        a: "Puede ser legítimamente real: Weverse Shop dice que los clientes de la UE pueden recibir instrucciones de pago aparte de la aduana local o de la empresa de mensajería. También es exactamente lo que imita una estafa. Verifícalo comprobando el número de seguimiento contra tu propio pedido y entrando tú mismo en el sitio de la mensajería, en lugar de seguir el enlace del mensaje.",
      },
      {
        q: "¿Cuál es la fecha límite para un pedido en periodo festivo coreano?",
        a: "Weverse Shop publica una por periodo festivo, con la hora exacta. Para el Chuseok de 2026, el cierre de recepción para direcciones fuera de Corea fue el 23 de septiembre a las 11:00 a. m. (KST), con reanudación del servicio exprés el 28 de septiembre. Advierte de que el calendario viene de la mensajería y puede cambiar, y de que los productos despachados ese día pueden recibirse una vez terminado el periodo festivo. Consulta el calendario vigente en lugar de reutilizar estas fechas.",
      },
      {
        q: "Mi seguimiento no se actualiza desde hace una semana. ¿Se ha perdido mi paquete?",
        a: "Mira primero la página de avisos por si hay una interrupción que cubra tu región. Cuando Weverse Shop avisó de retrasos en Europa y Oriente Medio en abril de 2026, dijo que los desvíos de ruta hacen que las actualizaciones del seguimiento y las llegadas locales tarden más de lo habitual y que el paquete sigue en tránsito, así que un seguimiento quieto durante una interrupción conocida es el síntoma y no el problema.",
      },
      {
        q: "Hay algo mal con mi artículo. ¿Trato con Weverse?",
        a: "No siempre. Weverse Shop indica que algunos productos los venden vendedores externos individuales, que entonces Weverse Company actúa únicamente como intermediario y no es parte de la transacción, y que no asume responsabilidad por la información del producto ni por las transacciones de esos vendedores. Comprueba qué tipo de artículo compraste antes de decidir a quién acudir.",
      },
      {
        q: "¿Me afecta el calendario festivo chino si no estoy en China?",
        a: "Los avisos dicen que esos calendarios se aplican a los pedidos con dirección de envío en China, porque las aduanas chinas cierran durante los periodos festivos. Si tu dirección está en otro sitio, lo que hay que vigilar son los cierres de recepción de los periodos festivos coreanos y cualquier interrupción del transporte que esté activa.",
      },
    ],
    labels: ES_LABELS,
  },
  {
    locale: "es",
    slug: "order-from-weverse-shop-overseas",
    sourceChecked: "2026-10-21",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Pedir en Weverse Shop desde fuera de Corea",
    summary:
      "En qué tienda estás, por qué el precio cambia al pagar, qué métodos de pago te toca de verdad según tu moneda, y los países a los que Corea no puede enviar.",
    scope:
      "Cubre los pedidos en Weverse Shop de productos físicos y álbumes enviados desde Corea. Las membresías y la venta de entradas se gestionan aparte y están en la guía de preventa. Las reglas de aquí salen de los avisos de Weverse Shop y cambian sin mucho preaviso.",
    intro: [
      "Casi todas las guías en inglés sobre Weverse Shop siguen diciendo que la tienda global acepta PayPal o Eximbay y nada más. Eso era verdad hace años. La lista de pagos es más larga ahora, la decide la moneda en la que está tu cuenta y no el país en el que vives, y desde febrero de 2026 el precio de la página del producto no es el precio que pagas.",
      "Nada de eso está escondido: está en los avisos de la propia tienda, que es de donde sale todo lo de abajo. Lo que pasa es que nadie que escribe estas guías fue a leerlos.",
    ],
    steps: [
      {
        title: "Averigua en qué Weverse Shop estás en realidad",
        body: "Weverse Shop no es una sola tienda. Hay una tienda GLOBAL y hay tiendas regionales, y llevan existencias distintas, abren ventanas de pedido anticipado distintas y envían desde sitios distintos. Un artículo que viste pedir a otra persona puede simplemente no existir en tu tienda. Comprueba en cuál estás antes de organizarte alrededor de una fecha de lanzamiento, porque un cierre de pedido anticipado en una tienda no te dice nada de las demás.",
        pitfall:
          "Un enlace que alguien comparte en una comunidad de fans abre su tienda, no la tuya. Si la página carga pero el artículo no entra en el carrito, normalmente estás en la tienda equivocada y no es que llegues tarde.",
        takes: "2 minutos",
      },
      {
        title: "Configura tu moneda antes de mirar cualquier cosa",
        body: "Tu moneda predeterminada decide qué métodos de pago te ofrecen. Weverse los indica por moneda: USD tiene PayPal, Eximbay, Alipay+, Apple Pay, WeChat Pay y Grab Pay. JPY tiene la misma lista sin Grab Pay. CNY se queda sin PayPal. MXN es solo PayPal y Apple Pay. KRW añade las tarjetas coreanas y los monederos coreanos: Toss, NAVER Pay, Kakao Pay, PAYCO. MXN es la más corta de las cuatro listas fuera del won coreano y la que conviene planificar: dos métodos, los dos digitales, sin opción en efectivo. Si no tienes ninguno de los dos preparado, en la caja no hay un tercer botón.",
        pitfall:
          "En las monedas distintas de KRW no existe un simple «pagar con Visa». Tu tarjeta pasa por PayPal o Eximbay, que para tu banco es una transacción de otro tipo que un cargo de un comercio coreano, y ese es el motivo de que una tarjeta que funciona en otros sitios pueda fallar aquí.",
        takes: "3 minutos",
      },
      {
        title: "Cuenta con que el precio suba al pagar, y entiende por qué",
        body: "Desde el 3 de febrero de 2026, Weverse calcula los impuestos a partir de tu dirección de envío y de facturación. Los pedidos que van a Corea muestran precios con impuestos incluidos durante todo el proceso. Los pedidos que van a cualquier otro sitio muestran el precio de la página del producto sin impuestos, y el impuesto del destino se añade al pagar, una vez que introduces una dirección. El número de la página del producto no es el número que pagas, y eso es deliberado y no un fallo.",
        pitfall:
          "Esto se parece exactamente a una estafa o a un error, y es el punto en el que la gente abandona el pedido. La subida es el impuesto que cobra tu propio país, recaudado por adelantado en lugar de por la aduana más tarde.",
        takes: "1 minuto",
      },
      {
        title: "Rellena la dirección de facturación, no solo la de envío",
        body: "El mismo cambio de febrero de 2026 añadió un campo de dirección de facturación al pagar, porque el cálculo del impuesto la necesita. Para algunos productos intangibles — artículos y contenidos digitales — la dirección de facturación puede ser obligatoria en lugar de opcional. Introdúcela con precisión: es de donde se calcula el tipo impositivo, y una dirección equivocada no es algo que puedas corregir después sin más.",
        pitfall:
          "Copiar la dirección de envío en el campo de facturación sin pensar está bien cuando coinciden y está mal cuando no. Si tu tarjeta está registrada en otra dirección, usa esa.",
        takes: "2 minutos",
      },
      {
        title: "Comprueba el idioma de tu dirección según el destino",
        body: "Weverse pide a los clientes internacionales que verifiquen en qué idioma necesita la dirección el país de destino antes de escribirla. La regla es más clara en el otro sentido: un pedido que se envía a Corea del Sur tiene que llevar la dirección en coreano, porque las empresas de mensajería pueden no aceptar una dirección en inglés o procesarla mal. Para todo lo demás, escribe la dirección como la espera el servicio postal de tu propio país.",
        pitfall:
          "Transliterar una dirección coreana al alfabeto latino es la causa más frecuente de una entrega retrasada o fallida en pedidos que van a Corea.",
        takes: "5 minutos",
      },
      {
        title: "Confirma que Corea puede enviarte algo",
        body: "El envío desde Corea del Sur no está disponible para una lista de países y regiones que Weverse mantiene y actualiza. En la revisión del 15 de julio de 2026 incluye Myanmar, la República Democrática del Congo, Irak, Irán, Líbano, Malí, Rusia, Andorra, Ucrania, Bielorrusia, Afganistán, las Antillas Neerlandesas, Israel y Turquía. La lista se mueve, así que consulta el aviso y no esta página.",
        pitfall:
          "La lista se describe como una interrupción temporal y no como una política, lo que significa que un país puede salir de ella igual que entrar. Ni un pedido anterior que salió bien ni el pedido de una amiga el año pasado deciden si puedes pedir hoy.",
        takes: "2 minutos",
      },
      {
        title: "Pide dentro de la ventana de pedido anticipado si los extras te importan",
        body: "Los beneficios del pedido anticipado — los pósteres, las photocards y los extras de primera edición, que suelen ser el motivo de comprar en la tienda oficial y no en otro sitio más barato — están ligados a la ventana de pedido anticipado y no al álbum. Una vez que la ventana cierra, el mismo álbum se envía sin ellos. Si los extras son el objetivo, lo que hay que planificar es la fecha límite y no la fecha de lanzamiento.",
        pitfall:
          "Las ventanas de pedido anticipado cierran a una hora coreana, que es la tarde anterior o la madrugada en casi toda América Latina.",
        takes: "Antes del cierre",
      },
    ],
    faq: [
      {
        q: "¿Puedo pagar con Visa o Mastercard en Weverse Shop?",
        a: "No como opción directa de tarjeta fuera de la configuración en moneda coreana. En USD, JPY, CNY y MXN la tarjeta pasa por PayPal o Eximbay. Eso sigue llegando a tu tarjeta, pero tu banco ve un tipo de transacción distinto, así que vale la pena activar los pagos internacionales con antelación.",
      },
      {
        q: "¿Por qué subió el precio cuando puse mi dirección?",
        a: "Desde el 3 de febrero de 2026 los precios fuera de Corea se muestran en la página del producto sin impuestos, y el impuesto de tu destino se añade al pagar. Es el impuesto que cobra tu propio país, recaudado en el momento de la compra y no en la entrega.",
      },
      {
        q: "¿Me van a cobrar aduana cuando llegue?",
        a: "Weverse ahora prepaga derechos e impuestos al pagar en los pedidos a los que corresponde, lo que según dice reduce la necesidad de un pago adicional durante el despacho. Indica que esto no se aplica a todos los países ni regiones, así que es una expectativa razonable y no una garantía.",
      },
      {
        q: "Estoy en México. ¿Qué métodos de pago me tocan en realidad?",
        a: "Dos. El aviso de pagos de Weverse indica para MXN PayPal y Apple Pay — la más corta de las cuatro listas fuera del won coreano, y las dos digitales. No hay opción en efectivo ni un tercer botón, así que prepara uno de los dos antes de una ventana de pedido anticipado y no dentro de ella.",
      },
      {
        q: "¿Weverse Shop envía a mi país?",
        a: "Normalmente sí, pero hay una lista mantenida de países y regiones que de momento no pueden recibir envíos desde Corea del Sur. Consulta ese aviso para ver la lista vigente antes de pedir: se revisa cuando cambian las condiciones.",
      },
    ],
    labels: ES_LABELS,
  },
  {
    locale: "de",
    slug: "buy-k-pop-concert-tickets-from-overseas",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "K-Pop-Konzerttickets von außerhalb Koreas kaufen",
    summary:
      "Das ganze Bild, bevor Sie anfangen: auf welcher Plattform Ihre Veranstaltung liegt, welche Identitätsprüfung dort läuft, und was bereitliegen muss, bevor der Verkauf öffnet.",
    scope:
      "Behandelt Veranstaltungen in Südkorea und die Ticketplattformen, die koreanische Agenturen nutzen. Tourtermine im Ausland werden von örtlichen Veranstaltern verkauft und getrennt behandelt — die Regeln unten gelten für sie nicht.",
    intro: [
      "Fast jede Anleitung, die zu dieser Frage weit oben steht, wurde vor Dezember 2025 geschrieben und schickt Sie auf eine Seite, die es unter diesem Namen nicht mehr gibt. Das ist der Hauptgrund, warum es diese Seite gibt.",
      "Es gibt keine eine K-Pop-Ticketseite. Die Plattform wird je Tournee von Agentur und Veranstalter gewählt und in der offiziellen Ankündigung zu dieser Veranstaltung genannt. Alles Weitere — welche Identitätsprüfung Sie erwartet, ob eine ausländische Karte funktioniert, wie früh der Vorverkauf öffnet — folgt aus dieser einen Tatsache.",
      "Die Reihenfolge lautet also: zuerst die offizielle Ankündigung finden, dann die Plattform bestimmen, dann sich auf die konkreten Anforderungen dieser Plattform vorbereiten. Andersherum landet man mit einem verifizierten Konto auf der falschen Seite, eine Stunde vor dem Verkauf.",
    ],
    steps: [
      {
        title: "Finden Sie die offizielle Ankündigung, nicht den Repost eines Fans",
        body: "Gehen Sie auf die offiziellen Kanäle der Künstler — die Seite der Agentur, die Weverse-Community der Künstler und ihre offiziellen Konten auf X und Instagram. Die Ankündigung nennt die Ticketplattform, die Zeiten für Vorverkauf und allgemeinen Verkauf in KST, die für den Vorverkauf nötige Mitgliedschaftsstufe sowie etwaige Bedingungen zu Wohnsitz oder Verifizierung. Machen Sie einen Screenshot davon. Alles Weitere hängt an diesem einen Dokument.",
        pitfall:
          "Fan-Konten fassen zusammen und formulieren um, und sie liegen oft genug bei der Plattform falsch, um Sie den Verkauf zu kosten. Außerdem aktualisieren sie selten, wenn sich ein Termin verschiebt.",
        takes: "10 Minuten",
      },
      {
        title: "Bestimmen Sie Ihre Plattform — und schließen Sie nicht vom Label darauf",
        body: "Künstler von HYBE laufen in der Regel über das eigene Ticketing von Weverse. Andere koreanische Tourneen nutzen häufig NOL Ticket (die koreanischsprachige Seite) oder NOL World (das Gegenstück für das Ausland), YES24 oder Melon Ticket. Das ist allerdings eine Tendenz und keine Regel: Agenturen wechseln zwischen Tourneen die Plattform, und eine einzelne Tournee kann den koreanischen und den globalen Verkauf auf zwei verschiedene Seiten aufteilen. Lesen Sie die Ankündigung.",
        pitfall:
          "Die Zuordnung als feststehend zu behandeln — „HYBE heißt Weverse, SM heißt YES24“ — ist der häufigste Fehler in bestehenden Anleitungen. Er trifft oft genug nicht zu, um ins Gewicht zu fallen.",
        takes: "5 Minuten",
      },
      {
        title: "Klären Sie, welche Identitätsprüfung Sie erwartet",
        body: "Koreanischsprachige Ticketseiten prüfen die Identität in der Regel gegen eine koreanische Mobilfunknummer, für die man praktisch ein koreanisches Aufenthaltsdokument braucht. Haben Sie keines, ist die koreanischsprachige Seite nicht Ihr Weg. Die nach außen gerichteten Seiten existieren genau für diesen Fall und prüfen auf anderem Weg — üblicherweise anhand von Passdaten, die zu Ihrem Konto passen müssen. Entscheiden Sie jetzt, welche Seite Sie nutzen, denn das nötige Konto liegt auf dieser Seite.",
        pitfall:
          "Die koreanischsprachige Seite erzwingen zu wollen ist verlorene Mühe, und bei Konstruktionen, die für die Verifizierung die Identität einer anderen Person borgen, helfen wir nicht — sie setzen Ihr Ticket und Ihr Konto aufs Spiel.",
        takes: "15 Minuten",
      },
      {
        title: "Legen Sie das Konto mit exakt den Passdaten an",
        body: "Tragen Sie Ihren rechtlichen Namen so ein, wie er in der maschinenlesbaren Zone Ihres Passes steht, und Ihr Geburtsdatum in dem Format, das die Seite erwartet. Verlangt die Veranstaltung für den Vorverkauf eine Fanclub-Mitgliedschaft, müssen Name und Geburtsdatum auf der Mitgliedschaft und auf dem Ticketkonto gleich sein. Abweichungen sind eine dokumentierte Ursache für stornierte Bestellungen am Einlass oder während der Verifizierung.",
        pitfall:
          "Zweitnamen, Doppelnamen und die Reihenfolge der Namen sind die Stellen, an denen das bricht. Eine Mitgliedschaft auf „Maria Santos“ und ein Pass auf „Maria Elena Santos Cruz“ ist eine Abweichung.",
        takes: "20 Minuten",
      },
      {
        title: "Prüfen Sie Ihr Zahlungsmittel Tage vorher, nicht am Tag selbst",
        body: "Im Ausland ausgestellte Karten werden häufig akzeptiert, oft aber erst, nachdem Ihr Konto als Auslandskunde verifiziert wurde. Unabhängig davon kann Ihre Bank eine erstmalige Belastung durch einen koreanischen Händler blockieren, und Abfragen nach 3-D Secure können im In-App-Browser scheitern. Rufen Sie Ihre Bank an, schalten Sie internationale Zahlungen frei, und führen Sie, wenn die Plattform es zulässt, vorher einen kleinen unabhängigen Kauf durch.",
        pitfall:
          "Eine Karte, die im Bezahlschritt abgelehnt wird, gibt Ihren Platz binnen Minuten zurück in den Pool. Das ist der teuerste Fehlschlag im ganzen Ablauf und vollständig vermeidbar.",
        takes: "1-3 Tage Vorlauf",
      },
      {
        title: "Richten Sie sich für den Verkauf selbst ein",
        body: "Melden Sie sich an und schließen Sie jeden Verifizierungsschritt mindestens einen Tag vorher ab. Am Tag selbst sind Sie deutlich vor der Öffnungszeit eingeloggt, mit der offiziellen KST-Zeit als Bezug und nicht mit der Uhr Ihres Geräts. Entscheiden Sie Ihre Platzwünsche vorher — die meisten Warteschlangensysteme geben Ihnen ein kurzes Fenster zum Auswählen und Bezahlen, bevor sie Ihre Reservierung freigeben.",
        pitfall:
          "Ein frisches Inkognito-Fenster „zur Sicherheit“ zu öffnen bedeutet, sich innerhalb der Warteschlange neu anzumelden und neu zu verifizieren. Tun Sie das nicht.",
        takes: "30 Minuten vor Öffnung",
      },
      {
        title: "Kennen Sie die Regeln zum Weiterverkauf, bevor Sie ihn erwägen",
        body: "Südkorea hat seine Regeln zum Ticketweiterverkauf mit einer Novelle des Aufführungsgesetzes verschärft, die am 28. August 2026 in Kraft trat — im Januar geändert, im Februar verkündet, seit Ende August in Kraft. Berichte über die Änderung beschreiben ein Verbot des gewerbsmäßigen oder gewohnheitsmäßigen Weiterverkaufs über dem Kaufpreis, das auch den Kauf in Weiterverkaufsabsicht erfasst und nicht mehr auf Käufe mit Automatisierung beschränkt ist. Berichtete Sanktionen reichen bis zum Fünfzigfachen des Verkaufswerts als Geldbuße sowie zur Einziehung der Erlöse. Behandeln Sie den Weiterverkauf über Nennwert bei koreanischen Veranstaltungen als ausgeschlossen und nutzen Sie die offizielle Weiterverkaufs- oder Übertragungsfunktion der Plattform, sofern die Veranstaltung eine anbietet.",
        pitfall:
          "Das ist neues Recht, erst seit August 2026 in Kraft, und die Schwelle für „gewohnheitsmäßig“ wird in der Praxis noch bestimmt. Dass ein Angebot auf einem internationalen Weiterverkaufsmarktplatz existiert, sagt nichts darüber, ob es für Sie sicher ist, dort zu kaufen oder zu verkaufen.",
        takes: "5 Minuten",
      },
    ],
    faq: [
      {
        q: "Wenn meine Mitgliedschaft vor dem Vorverkauf abläuft, kann ich sie einfach rechtzeitig verlängern?",
        a: "Nur wenn die Verlängerung vor der Frist für die Berechtigung greift, und diese Frist liegt meist früher als der Vorverkauf selbst. Auto Payment im Weverse Shop, seit dem 3. September 2026 für unterstützte Mitgliedschaften verfügbar, bucht am letzten Tag der Laufzeit über eine hinterlegte Zahlungsmethode ab und schließt die Lücke ganz. Richten Sie es ein, bevor eine Tournee angekündigt wird, und nicht danach.",
      },
      {
        q: "Brauche ich eine koreanische Telefonnummer, um K-Pop-Konzerttickets zu kaufen?",
        a: "Für die koreanischsprachigen Ticketseiten hängt die Identitätsprüfung in der Regel an einer koreanischen Mobilfunknummer, und für eine solche braucht man normalerweise koreanische Aufenthaltsdokumente. Für die nach außen gerichteten Seiten in der Regel nicht — sie prüfen Auslandskunden auf anderem Weg, üblicherweise über Passdaten. Was für Sie gilt, hängt davon ab, über welche Plattform Ihre Veranstaltung verkauft wird.",
      },
      {
        q: "Kann ich eine ausländische Kreditkarte verwenden?",
        a: "Auf den nach außen gerichteten Plattformen meist ja, und oft erst, nachdem Ihr Konto als Auslandskunde verifiziert ist. Rechnen Sie damit, dass Ihre eigene Bank die andere Hälfte des Problems ist: Schalten Sie internationale Zahlungen vorab frei und seien Sie auf eine Abfrage nach 3-D Secure gefasst.",
      },
      {
        q: "Wie früh öffnet der Fanclub-Vorverkauf?",
        a: "Das ist je Veranstaltung verschieden, und die offizielle Ankündigung ist die einzige verlässliche Antwort. Vorverkaufsfenster liegen häufig einen Tag oder mehr vor dem allgemeinen Verkauf, und die Mitgliedschaft muss meist vor einer noch früheren Frist aktiv sein. Schließen Sie nicht von einer früheren Tournee auf den Zeitplan.",
      },
      {
        q: "Sind die koreanische und die globale Seite dieselbe Warteschlange?",
        a: "Nicht zwangsläufig. Kontingente, Verifizierung und die Anerkennung der Fanclub-Mitgliedschaft können zwischen einem koreanischsprachigen und einem globalen Verkauf derselben Veranstaltung getrennt behandelt werden. Eine auf der einen Seite verifizierte Mitgliedschaft wird auf der anderen nicht automatisch anerkannt, prüfen Sie also in der Ankündigung, was für Sie gilt.",
      },
    ],
    labels: DE_LABELS,
  },
  {
    locale: "de",
    slug: "nol-world-verified-member-ekyc",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "NOL World Verified Member: die eKYC-Prüfung aus dem Ausland bestehen",
    summary:
      "Manche Veranstaltungen lassen Sie überhaupt nicht buchen, bevor Ihr Pass verifiziert ist. Die Prüfung ist eine Live-Aufnahme von Pass und Gesicht, sie lässt sich nicht beiläufig wiederholen, und die eine Anweisung von NOL World zum Zeitpunkt ist die, die die meisten übergehen.",
    scope:
      "Behandelt die Identitätsprüfung Verified Member Only auf NOL World, so wie NOL World sie dokumentiert: wann sie gilt, was die Aufnahme braucht, was mit dem gespeicherten Namen geschieht, und was sie zurücksetzt oder einschränkt. Inhaberinnen und Inhaber koreanischer Pässe werden stattdessen auf NOL Ticket verwiesen, eine andere Prüfung auf einer anderen Seite. Nichts hier ist ein Weg um eine Verifizierung herum.",
    intro: [
      "Eine Veranstaltung mit Verified Member Only ist eine, die Sie überhaupt nicht buchen können, bevor Ihre Identität verifiziert ist. Keine Warnung an der Kasse — die Reservierung ist für ein nicht verifiziertes Konto schlicht nicht verfügbar. Fans erfahren das in dem Moment, in dem die Buchung öffnet, und das ist der denkbar schlechteste, denn die Verifizierung ist eine Live-Aufnahme Ihres Passes und Ihres Gesichts und dauert, so lange sie dauert.",
      "NOL World erklärt den Dienst als Weg, den Zugang für unbefugte Zwecke wie den Ticketweiterverkauf einzuschränken. Das sollte man wörtlich nehmen: Die Prüfung existiert, um eine Person an ein Konto zu binden, und fast jede Regel unten folgt daraus.",
    ],
    steps: [
      {
        title: "Prüfen Sie, ob Ihre Veranstaltung sie braucht und ob Sie auf der richtigen Seite sind",
        body: "Verified Member Only wird je Produkt gesetzt und nicht je Konto — NOL World sagt, dass nur Mitglieder, die die Identitätsprüfung auf der Produktseite abgeschlossen haben, Reservierungen vornehmen können. Die erste Frage ist also, ob Ihre Veranstaltung die Kennzeichnung überhaupt trägt. Die zweite ist, ob Sie auf NOL World sein sollten: NOL World verweist Inhaberinnen und Inhaber koreanischer Pässe stattdessen auf die Seite NOL Ticket, die eine völlig andere Prüfung durchführt.",
        pitfall:
          "Anzunehmen, die Identitätsprüfung sei eine einmalige Pflicht, zu der die Seite Sie schon auffordern wird. Bei einer Veranstaltung mit Verified Member Only gibt es keine Aufforderung — die Buchung ist einfach nicht da.",
        takes: "10 Minuten",
      },
      {
        title: "Erledigen Sie es ein bis zwei Tage vor Öffnung der Buchung",
        body: "Das ist NOL Worlds eigene Anweisung und die nützlichste Tatsache auf dieser Seite: Schließen Sie die Verifizierung mindestens ein bis zwei Tage im Voraus ab, denn ein Versuch kurz vor der Ticketöffnung kann durch hohes Aufkommen Schwierigkeiten machen. Ist sie einmal erledigt, können Sie jede Veranstaltung mit Verified Member Only buchen, ohne erneut zu verifizieren. Der Preis für früh ist ein Abend. Der Preis für spät ist die Veranstaltung.",
        pitfall:
          "Die Aufnahme in den zehn Minuten vor einem Vorverkauf zu beginnen. Eine Verifizierung, die am Andrang scheitert, lässt sich nicht beschleunigen, und die Warteschlange wartet nicht.",
        takes: "30 Minuten, zwei Tage vorher",
      },
      {
        title: "Verifizieren Sie das Konto, mit dem Sie tatsächlich kaufen werden",
        body: "Die Verifizierung ist einmalig pro Konto, und NOL World gibt an, dass die verifizierten Angaben nicht erneut verwendet werden können — ein Pass verifiziert ein Konto. Haben Sie mehrere Konten, ist jetzt der Moment, zu entscheiden, welches das echte ist, denn die Verifizierung wandert danach nicht mehr. NOL World ergänzt, dass das Löschen eines Kontos dessen verifizierte Angaben entfernt und für ein anderes freigibt, dass aber ein wegen Missbrauchs eingeschränktes Konto überhaupt nicht gelöscht werden kann.",
        pitfall:
          "Auf dem Konto zu verifizieren, in dem Sie zufällig angemeldet waren, und dann auf dem anderen zu kaufen. Das zweite Konto ist nicht verifiziert, und die Veranstaltung ist Verified Member Only.",
        takes: "5 Minuten Entscheidung",
      },
      {
        title: "Halten Sie den Originalpass bereit, gültig und nicht abgelaufen",
        body: "Akzeptiert werden nur gültige Pässe, und NOL World ist ausdrücklich: Fotos oder Kopien nicht. Kein ausgedruckter Scan, kein Screenshot, kein Foto der Seite auf einem anderen Bildschirm. Ist Ihr Pass abgelaufen, müssen Sie ihn erneuern, bevor Sie verifizieren können — für Inhaberinnen und Inhaber eines nicht koreanischen Passes gibt es auf NOL World keinen alternativen Dokumentenweg.",
        pitfall:
          "Zum Passfoto zu greifen, das ohnehin schon in der Fotogalerie liegt, weil der echte Pass im Hotelsafe ist. Dieser Versuch wird als Versuch mit einer Kopie erfasst.",
        takes: "—",
      },
      {
        title: "Schaffen Sie die Aufnahme im ersten Anlauf",
        body: "NOL World veröffentlicht, woran die Aufnahme scheitert, und die Liste liest sich wie eine Liste dessen, was Menschen in Eile tun. Richten Sie Pass und Gesicht an den Hilfslinien auf dem Bildschirm aus. Halten Sie Blendungen und Spiegelungen sowohl von der Passseite als auch von Ihrem Gesicht fern. Ihr Gesicht muss zum Passfoto passen. Halten Sie das Gerät mindestens fünf Sekunden lang ruhig, während es aufnimmt. Und bei einem schwachen Gerät oder instabilem Netz können die Daten auch dann nicht korrekt gespeichert werden, wenn die Aufnahme gut aussah. Scheitert sie, nennt der Bildschirm den Grund — lesen Sie ihn, statt blind erneut zu versuchen.",
        pitfall:
          "Das Ganze einhändig, nachts, unter einer Deckenlampe zu machen, die sich in der Laminatfolie spiegelt. Licht von oben auf einer Passseite ist der häufigste Grund, warum eine Aufnahme nicht lesbar ist.",
        takes: "15 Minuten",
      },
      {
        title: "Prüfen Sie den Namen, der tatsächlich gespeichert wurde",
        body: "Akzeptiert werden nur englische Namen. NOL World sagt, dass die Reservierung nicht fortgesetzt werden kann, wenn Ihr Passname nicht in englischer Schrift vorliegt oder Sonderzeichen enthält, und dass Sie zu einem Antrag auf Namenskorrektur weitergeleitet werden können — eine Einreichung, keine Einstellung. Der gespeicherte Name ist auf My Page sichtbar, und dort gehört er geprüft statt angenommen. Das zählt jetzt, weil Sie nach der Verifizierung Name, Geburtsdatum und E-Mail-Adresse überhaupt nicht mehr ändern können: Reservierungen sind nur noch mit den verifizierten Angaben möglich.",
        pitfall:
          "Den Namen ungeprüft zu lassen, weil die Verifizierung Erfolg gemeldet hat. Erfolgreich sein und die richtigen Zeichen speichern sind zwei verschiedene Dinge, und eines davon ist nicht mehr änderbar.",
        takes: "5 Minuten",
      },
      {
        title: "Verstehen Sie die Namensreihenfolge — und was am Einlass wirklich zählt",
        body: "NOL World hat die gespeicherte Namensreihenfolge am 16. April 2025 geändert. Vor diesem Datum verifizierte Mitglieder führen Vorname + (zweiter Vorname) + Nachname; danach verifizierte Mitglieder führen Nachname + Vorname + (zweiter Vorname). NOL World sagt klar, dass Ticketprüfung und Einlass am Veranstaltungsort auch dann möglich sind, wenn die Reihenfolge von Ihrem Pass abweicht — die Prüfung vor Ort wird nur eingeschränkt, wenn der Name selbst vom Passnamen abweicht. Bei vor dem 16. April 2025 verifizierten Mitgliedern wird das neue Format angewendet, wenn sie nach Ablauf des Passes erneut verifizieren.",
        pitfall:
          "Einen Antrag auf Namenskorrektur zu stellen, weil die Reihenfolge falsch aussieht. NOL World sagt, die Reihenfolge ist nicht das Problem; ein abweichender Name ist es. Es geht um die Zeichen, nicht um die Abfolge.",
        takes: "5 Minuten",
      },
      {
        title: "Wissen Sie, was eine bereits bestandene Verifizierung aufheben kann",
        body: "Eine abgeschlossene Verifizierung kann nachträglich aufgehoben werden. NOL World nennt zwei Ursachen: den Versuch einer Verifizierung mit einem gefälschten oder veränderten Ausweis — wozu es ausdrücklich auch ausgedruckte Kopien und Screenshots zählt — und das Ablaufen des zur Verifizierung verwendeten Passes. Wird Ihre aufgehoben, verifizieren Sie über das bestehende Konto erneut. NOL World warnt ausdrücklich, dass der Versuch mit einem neuen Konto zu wiederholten Systemfehlern führen kann, und dass eine betrügerisch erlangte Verifizierung Sie den Zugang zu den Buchungsdiensten kosten kann.",
        pitfall:
          "Ein frisches Konto anzulegen, um einer Zurücksetzung zu entkommen. Die Zurücksetzung folgte dem Dokument und nicht dem Konto, und das neue Konto erbt das Problem samt Verdacht.",
        takes: "—",
      },
      {
        title: "Wissen Sie, was die Plattform als Betrug zählt und was er kostet",
        body: "Der Grund für die Strenge der Prüfung steht in der Anti-Betrugs-Richtlinie von NOL World, und die Folgen sind veröffentlicht. Die Verwendung gestohlener oder gefälschter Ausweise zur Verifizierung ist als betrügerische Nutzung gelistet. Ebenso das Buchen mehrerer Tickets über den normalen Gebrauch hinaus mit identischen oder ähnlichen persönlichen Angaben — dieselben Kontaktdaten, dieselbe Lieferanschrift oder dieselben Zahlungsinformationen über mehrere Konten hinweg. Die Sanktionen reichen von einer Buchungssperre von drei Monaten oder mehr bis zur dauerhaften Kontosperrung und der Stornierung jedes gebuchten Tickets. Der Veranstalter kann eigene hinzufügen, bis hin zum Ausschluss aus dem Fanclub. Es gibt einen Einspruch, und wo betrügerischer Handel klar bestätigt ist, gibt es ihn nicht.",
        pitfall:
          "Mehrere Familienkonten von einem Telefon, einer Adresse und einer Karte aus zu verifizieren, um die Chancen in einem Vorverkauf zu erhöhen. Genau dieses Muster steht auf der veröffentlichten Liste, und die genannte Sanktion erfasst jedes Ticket auf jedem dieser Konten.",
        takes: "10 Minuten Lektüre",
      },
    ],
    faq: [
      {
        q: "Was bedeutet Verified Member Only auf einer Veranstaltungsseite konkret?",
        a: "Dass die Veranstaltung für nicht verifizierte Konten geschlossen ist. NOL World beschreibt es als Dienst, mit dem Mitglieder ihre Identität vor dem Kauf verifizieren können, und bei dem nur Mitglieder mit abgeschlossener Verifizierung auf der Produktseite reservieren können. Als Zweck nennt es die Einschränkung des Zugangs für unbefugte Zwecke wie den Ticketweiterverkauf. Halten Sie Pass und Smartphone bereit, die Prüfung braucht beides.",
      },
      {
        q: "Ich habe einen koreanischen Pass. Kann ich einfach auf NOL World verifizieren?",
        a: "NOL World verweist Inhaberinnen und Inhaber koreanischer Pässe stattdessen auf die Seite NOL Ticket. Das ist eine andere Seite mit einer anderen Identitätsprüfung — in der Regel koreanische Mobilfunk-Authentifizierung oder I-PIN — und einem eigenen Konto.",
      },
      {
        q: "Ich bin koreanische Staatsangehörige im Ausland ohne koreanische Mobilfunknummer. Was dann?",
        a: "NOL World veröffentlicht einen Dokumentenweg. Es verweist im Ausland lebende südkoreanische Staatsangehörige auf NOL Ticket, wo die Identität per Mobilfunk-Authentifizierung oder I-PIN geprüft werden kann; liegt keine koreanische Registriernummer vor und ist die Mobilfunk-Authentifizierung nicht verfügbar, akzeptiert es Nachweise über den Status als Auslandskoreanerin oder Auslandskoreaner — eine Bescheinigung über die Registrierung als Auslandskoreaner zusammen mit einem südkoreanischen Pass, eingereicht über das Anfrageformular des Kundendienstes mit Ihrer Konto-ID. Es sagt, die Bescheinigung lasse sich online über die Overseas Koreans Agency beschaffen, und dass eine Foreign Registration Card als Ersatz akzeptiert werden kann, wo die Bescheinigung schwer zu bekommen ist. Es warnt außerdem, dass gefälschte Unterlagen eine sofortige Einschränkung bedeuten.",
      },
      {
        q: "Gibt es ein Mindestalter für die Identitätsprüfung?",
        a: "NOL World sagt, für die Verifizierung selbst gebe es keine Altersgrenze, dass Sie aber Produkte mit Altersbeschränkungen dennoch nicht buchen oder besuchen können. Verifiziert zu sein ist nicht dasselbe, wie für eine bestimmte Veranstaltung berechtigt zu sein.",
      },
      {
        q: "Mein Name auf My Page steht in einer anderen Reihenfolge als im Pass. Werde ich abgewiesen?",
        a: "NOL World sagt nein. Es hat die gespeicherte Reihenfolge am 16. April 2025 geändert und gibt an, dass Ticketprüfung und Einlass auch bei abweichender Reihenfolge möglich sind. Die Prüfung vor Ort wird nur eingeschränkt, wenn der Name selbst abweicht — prüfen Sie also Schreibweise und Zeichen und nicht die Abfolge.",
      },
      {
        q: "Mein Pass ist nach der Verifizierung abgelaufen. Muss ich etwas tun?",
        a: "Ja. NOL World führt den Ablauf des Passes als Ursache dafür auf, dass eine abgeschlossene Verifizierung aufgehoben wird, eine Erneuerung bedeutet also erneutes Verifizieren — auf dem bestehenden Konto und nicht auf einem neuen. Wurden Sie vor dem 16. April 2025 verifiziert, wird dabei auch die neue Namensreihenfolge auf Ihren Datensatz angewendet.",
      },
      {
        q: "Kann ich mit dem Pass eines Familienmitglieds verifizieren, wenn meiner abgelaufen ist?",
        a: "Nein, und das ist die eine Frage mit einer veröffentlichten Folge statt einer Meinung. NOL World führt die Verwendung gestohlener oder gefälschter Ausweise zur Verifizierung unter den Handlungen auf, die es als betrügerische Nutzung behandelt, und die genannten Sanktionen reichen bis zur dauerhaften Kontosperrung und der Stornierung jedes gebuchten Tickets. Es sagt außerdem, dass am Veranstaltungsort eine Identitätsprüfung erfolgen kann, und bittet Sie, auf Ihren eigenen Namen und Ihr eigenes Konto zu buchen und einen gültigen Lichtbildausweis mitzubringen. Ein Ticket, das die Tür nicht übersteht, ist kein Ticket.",
      },
      {
        q: "Mein Konto wurde eingeschränkt. Gibt es einen Einspruch?",
        a: "NOL World veröffentlicht einen. Es sagt, Nutzerinnen und Nutzern werde in der Regel eine Frist von mindestens einem Tag zur Stellungnahme eingeräumt, und ein Einspruch solle eine ausführliche Darstellung mit der ID des eingeschränkten Kontos, dem vollständigen Namen und den Kontaktdaten sein, ohne vorgeschriebenes Format oder Muster, eingereicht über das Anfrageformular des Kundendienstes. Die Prüfung dauert etwa 10 bis 15 Tage und das Ergebnis kommt per E-Mail. Es nennt auch die Grenzen: Wird die Frist versäumt oder der Verdacht nicht ausgeräumt, werden Buchungen zwangsstorniert, und wo betrügerischer Handel klar bestätigt ist, können Tickets ohne jeden Einspruch storniert werden.",
      },
    ],
    labels: DE_LABELS,
  },
  {
    locale: "de",
    slug: "yes24-global-ticketing-guide",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "YES24 Global: die Regeln, die nicht auf der englischen Seite stehen",
    summary:
      "Ihr vorhandenes YES24-Konto funktioniert nicht. PayPal erscheint nur, wenn die Veranstaltung weit genug entfernt ist. Zwei Kartenarten werden rundheraus abgelehnt, und der Veranstaltungsort gleicht Ihren Pass mit dem Namen ab, mit dem Sie sich angemeldet haben.",
    scope:
      "Behandelt die englischsprachige Seite YES24 TICKET, die Käuferinnen und Käufer aus dem Ausland nutzen. Die koreanischsprachige YES24-Seite hat ein anderes Kontosystem und eine andere Identitätsprüfung. Bedingungen einzelner Veranstaltungen auf der Veranstaltungsseite gehen allem hier vor, und YES24 sagt das selbst.",
    intro: [
      "YES24 veröffentlicht seine Regeln für das Ausland in einem englischen Kaufleitfaden und einer FAQ, und fast nichts davon taucht in den Anleitungen auf, die dazu weit oben stehen. Sie sind konkret, sie sind ungewöhnlich, und mehrere davon beenden Ihre Buchung am Tag selbst, wenn Sie ihnen erstmals an der Kasse begegnen.",
      "Alles Folgende stammt aus diesen beiden Seiten, gelesen am 20. Oktober 2026. Wo YES24 sich selbst widerspricht — und das tut es einmal, bei einer Gebühr — sagt diese Seite es, statt die bequeme Zahl zu wählen.",
    ],
    steps: [
      {
        title: "Melden Sie sich neu an, auch wenn Sie schon ein YES24-Konto haben",
        body: "YES24 sagt es ausdrücklich: Bestehende YES24-Mitglieder, die die Seite Global YES24 TICKET nutzen wollen, müssen sich erneut anmelden. Es warnt außerdem, dass die globale Ticketseite etwas anderes ist als global.yes24.com, die Buchhandlung, und dass beide keine Mitgliedsdaten teilen. Nichtmitglieder können überhaupt nicht buchen, das ist also der erste Schritt und keine Formalität.",
        pitfall:
          "Drei YES24-Angebote mit ähnlichen Namen und ohne gemeinsamen Login. Das in einer Warteschlange zu entdecken heißt, es zu spät zu entdecken — das Konto muss ohnehin Tage früher existieren, wegen der Namensprüfung unten.",
        takes: "15 Minuten",
      },
      {
        title: "Tragen Sie den Namen genau so ein, wie Ihr Pass ihn führt",
        body: "Das ist die eine Stelle, an der eine Plattform ausspricht, was sonst unausgesprochen bleibt. Aus der FAQ von YES24: Weicht der Name Ihres YES24-Kontos vom Namen in Ihrem Pass ab, können Sie Schwierigkeiten bekommen, das gebuchte Ticket am Veranstaltungsort abzuholen. An der Abendkasse hinterlegte Tickets können nur von der Ticketinhaberin oder dem Ticketinhaber abgeholt werden, und für die Abholung braucht es einen physischen gültigen Ausweis — einen Pass — zusammen mit dem Buchungsnachweis.",
        pitfall:
          "Ein weggelassener zweiter Vorname, eine vor Jahren gewählte Umschrift, eine Reihenfolge mit dem Vornamen zuerst. Der Veranstaltungsort vergleicht zwei Dokumente und beurteilt nicht, ob Sie es offensichtlich sind.",
        takes: "10 Minuten",
      },
      {
        title: "Prüfen Sie, ob PayPal für Ihre Veranstaltung überhaupt angeboten wird",
        body: "PayPal gibt es auf YES24 Global nur, wenn zwischen Buchungsdatum und Veranstaltungsdatum mehr als 180 Tage liegen. Bei den meisten K-Pop-Konzerten, die ein bis zwei Monate vorher angekündigt werden, heißt das, dass PayPal schlicht keine Option ist und die Karte der einzige Weg. Außerdem fällt eine PayPal-Gebühr von 10 Cent an, die auch bei einer Stornierung nicht erstattet wird.",
        pitfall:
          "Mit PayPal zu planen, weil eine Anleitung sagte, es werde akzeptiert, und an der Kasse nur ein Kartenfeld vorzufinden. Die 180-Tage-Regel ist der Grund — kein Fehler, und nichts, was der Kundendienst aufheben kann.",
        takes: "2 Minuten",
      },
      {
        title: "Wissen Sie vorher, welche Karten abgelehnt werden",
        body: "Der Kaufleitfaden schließt außerhalb Koreas ausgestellte American-Express-Karten aus, und Karten von China UnionPay ganz. Alles andere läuft als Kartenzahlung durch — und YES24 gibt an, dass auf der globalen Seite eine Authentifizierung nach 3-D Secure erforderlich ist, die Karte muss dafür also bei Ihrer Bank freigeschaltet sein.",
        pitfall:
          "Eine American-Express-Karte, die auf jeder anderen Seite funktioniert, wird hier wegen des Ausstellungsorts abgelehnt und nicht wegen irgendetwas an der Karte. Dieser Fehlschlag sieht genauso aus wie eine Sperre der Bank, also verbringen Leute den Verkauf damit, ihre Bank wegen des falschen Problems anzurufen.",
        takes: "10 Minuten, mit Ihrer Bank",
      },
      {
        title: "Wählen Sie Abendkasse oder Auslandsversand bei der Buchung",
        body: "Beides gibt es, aber der Auslandsversand gilt je Veranstaltung und nicht allgemein: YES24 sagt, die Verfügbarkeit hänge von der Aufführung ab und die Gebühr vom Zielort, und dass beides auf der Veranstaltungsseite steht. Die Versandart nachträglich zu ändern ist nur bis 20 Werktage vor der Veranstaltung möglich — vier Arbeitswochen, nicht vier Tage.",
        pitfall:
          "Zwanzig Werktage sind grob ein Kalendermonat. Wer zwei Wochen vorher bucht, behält die Art, die er in der Warteschlange gewählt hat.",
        takes: "5 Minuten",
      },
      {
        title: "Lesen Sie die Buchungs- und Stornouhr, die nicht das Veranstaltungsdatum ist",
        body: "Die Buchung schließt um 17 Uhr am Vortag einer Veranstaltung von Dienstag bis Samstag, und um 11 Uhr am Samstag für eine Veranstaltung am Sonntag oder Montag. Die Stornierung läuft auf genau derselben Uhr, und danach gibt es keine Stornierung, Änderung oder Erstattung mehr. Innerhalb von 7 Tagen nach dem Kauf ist die Stornierung kostenlos; danach fällt je Ticket eine Gebühr an, die mit näher rückender Veranstaltung auf 10%, 20% und 30% des gezahlten Betrags steigt. Die Grenze liegt bei 10 Tickets pro Person auf einmal.",
        pitfall:
          "Bei der Buchungsgebühr widerspricht YES24 sich selbst: Die FAQ nennt in einer Zeile 2.000 KRW und kündigt in der nächsten die Änderung auf 3.000 KRW je Ticket ab dem 14. August 2023 an. Behandeln Sie 3.000 als aktuell. So oder so ist sie nur bis 23:59 Uhr am Kauftag erstattbar und nicht innerhalb der 7-Tage-Frist, die für das Ticket selbst gilt.",
        takes: "5 Minuten",
      },
      {
        title: "Bringen Sie Pass und Buchungsnachweis zum Veranstaltungsort",
        body: "Die Abholung verlangt einen physischen gültigen Ausweis — YES24 nennt den Pass — zusammen mit dem Nachweis der Buchungsbestätigung. Der Kaufleitfaden sagt außerdem, Sie sollen die Kaufdaten ausdrucken und an der Kasse abgeben. Die Regelung der einzelnen Veranstaltung auf deren Seite geht dem vor, und YES24 sagt, die Veranstaltungsseite gewinne, lesen Sie sie also auch dann, wenn Sie an diesem Ort schon einmal abgeholt haben.",
        pitfall:
          "Ein Foto der Bestätigung auf dem Handy ist nicht das, was beschrieben wird. Drucken Sie sie aus, und tragen Sie den Pass bei sich, mit dem Sie sich registriert haben, und keinen anderen Ausweis.",
        takes: "Am Veranstaltungsort",
      },
    ],
    faq: [
      {
        q: "Kann ich mein vorhandenes YES24-Konto auf der englischen Seite nutzen?",
        a: "Nein. YES24 sagt, bestehende Mitglieder müssten sich für die Seite Global YES24 TICKET erneut anmelden, und dass diese von global.yes24.com getrennt ist und keine Mitgliedsdaten teilt.",
      },
      {
        q: "Warum fehlt PayPal an der Kasse?",
        a: "PayPal wird nur angeboten, wenn zwischen Buchungsdatum und Veranstaltungsdatum mehr als 180 Tage liegen. Die meisten Konzertbuchungen liegen deutlich darunter, also ist die Karte der einzige Weg.",
      },
      {
        q: "Welche Karten lehnt YES24 Global ab?",
        a: "Außerhalb Südkoreas ausgestellte American-Express-Karten und Karten von China UnionPay. Andere Karten werden akzeptiert, müssen aber 3-D Secure bestehen, das die Seite verlangt.",
      },
      {
        q: "Kann jemand anderes mein Ticket abholen?",
        a: "Nein. An der Abendkasse hinterlegte Tickets können nur von der Ticketinhaberin oder dem Ticketinhaber abgeholt werden, mit einem physischen Pass und dem Buchungsnachweis — es sei denn, die einzelne Veranstaltung sagt auf ihrer eigenen Seite etwas anderes.",
      },
      {
        q: "Wie lange dauert eine Erstattung?",
        a: "Für Karten werden 3 bis 7 Tage angegeben, wobei die Regelung des Kartenunternehmens entscheidet, und bis zu 30 Tage. PayPal-Erstattungen gehen innerhalb von 5 Werktagen auf das PayPal-Guthaben zurück — zum Wechselkurs am Tag der Erstattung einschließlich des Umrechnungsaufschlags, sodass der zurückgezahlte Betrag geringer ausfallen kann als der gezahlte.",
      },
    ],
    labels: DE_LABELS,
  },
  {
    locale: "de",
    slug: "nol-world-queue-and-seat-selection",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Die Warteschlange von NOL World, und was Ihren Platz darin zurücksetzt",
    summary:
      "Aktualisieren löscht Ihre Position. Ein zweites Gerät schließt Ihre erste Nummer. Plätze aktualisieren sich ohne Neuladen. Alles davon steht in der FAQ von NOL World, und alles davon widerspricht dem, was Menschen instinktiv tun.",
    scope:
      "Behandelt das Verhalten von Warteschlange, Sitzplan und Warteliste auf NOL World während eines Verkaufs. Registrierung und Verifizierung für Auslandskunden geschehen vor all dem und stehen in der NOL-World-Anleitung. Alles hier stammt aus der veröffentlichten FAQ von NOL World.",
    intro: [
      "Der Instinkt in einer Ticketwarteschlange ist, zu aktualisieren und einen zweiten Browser zu öffnen, falls der erste hängt. Auf NOL World kostet Sie beides genau das, was Sie zu schützen versuchen, und die Plattform sagt das in ihren eigenen Hilfeseiten.",
      "Das ist der Teil eines Verkaufs, den keine Anleitung abdeckt, weil er sich von außen nicht erschließen lässt — man sieht ihn einmal, für neunzig Sekunden, in Panik.",
    ],
    steps: [
      {
        title: "Nicht aktualisieren. Aktualisieren setzt Ihre Position zurück",
        body: "NOL World sagt es ausdrücklich: Die Warteschlange lässt sich nicht überspringen, und wenn Sie die Seite aktualisieren, wird Ihre Position in der Warteschlange zurückgesetzt. Nicht erneut geprüft, nicht erneut abgefragt — zurückgesetzt. Welche Nummer Sie auch hielten, sie geht ans Ende.",
        pitfall:
          "Eine Warteschlangenseite, die eingefroren aussieht, ist meistens einfach eine Warteschlangenseite. Die eine Handlung, die sich danach anfühlt, etwas zu tun, ist die eine Handlung, die das bereits abgesessene Warten zunichtemacht.",
        takes: "Die ganze Warteschlange",
      },
      {
        title: "Ein Konto bekommt eine Nummer, und ein zweiter Versuch tötet die erste",
        body: "Pro Konto erhalten Sie nur eine Wartenummer. Versuchen Sie mehr — ein zweiter Browser, ein Telefon neben dem Laptop — schließt NOL World die zuerst erhaltene Nummer. Drücken Sie Reserve von einem anderen Gerät, während Sie bereits in der Schlange stehen, werden Sie gefragt, ob Sie die bestehende Warteschlange behalten oder eine neue beginnen wollen, und eine neue bedeutet, auf diesem Gerät wieder von vorn zu warten.",
        pitfall:
          "Ein Ersatzgerät zu öffnen ist die verbreitetste Ticketing-Taktik in Fan-Communities und hier strikt schlechter, als gar nichts zu tun. Die Abfrage, die erscheint, bietet Ihnen keine zweite Chance an; sie fragt, welche Sie wegwerfen wollen.",
        takes: "0 Minuten, wenn Sie widerstehen",
      },
      {
        title: "Eine Wartenummer ist kein Ticket",
        body: "NOL World sagt, eine Position in der Warteschlange garantiere kein Ticket, weil die Verfügbarkeit begrenzt ist und Tickets der Reihe nach ausgegeben werden. Die Warteschlange entscheidet, wann Sie es versuchen dürfen, und nicht, ob bei Ihrer Ankunft noch etwas da ist. Die Warteschlange gilt für jedes auf NOL World buchbare Produkt und nicht nur für die stark nachgefragten.",
        pitfall:
          "Eine niedrige Wartenummer als Ergebnis zu lesen. Sie ist ein Platz in der Reihe, und der Bestand kann weg sein, bevor Sie dran sind.",
        takes: "1 Minute",
      },
      {
        title: "Hören Sie auch beim Sitzplan auf zu aktualisieren — er aktualisiert sich selbst",
        body: "Das Buchungssystem wurde so umgebaut, dass freie Plätze in Echtzeit und ohne Neuladen aktualisiert werden. Von anderen gehaltene Plätze verschwinden und stornierte Plätze kommen von selbst zurück. Sehen Sie „dieser Platz wurde bereits ausgewählt“, heißt das, dass eine andere Person fast im selben Moment denselben Platz gewählt hat — und nicht, dass Ihre Seite veraltet ist.",
        pitfall:
          "Den Sitzplan zu aktualisieren kostet dasselbe wie die Warteschlange zu aktualisieren. Die Gewohnheit von älteren Ticketseiten ist hier genau die falsche Gewohnheit.",
        takes: "Während der Auswahl",
      },
      {
        title: "Lesen Sie die Ausverkaufsquote als das, was sie misst",
        body: "Wo eine Ausverkaufsquote gezeigt wird, erscheint sie erst, wenn 90% oder mehr aller Plätze bezahlt sind, und sie zählt bezahlte Tickets und nicht auswählbare. Zahlen zu Restplätzen werden womöglich gar nicht angezeigt: NOL World sagt, das entscheide der Veranstalter, und dass es bei stark nachgefragten Produkten eine Verzögerung zwischen Anzeige und tatsächlicher Verfügbarkeit gibt.",
        pitfall:
          "Einen Ausverkaufsprozentsatz als Live-Bestand zu behandeln. Es ist eine Zahl bezahlter Tickets mit einer Untergrenze von 90%, und der Abstand zur Wirklichkeit ist genau dann am größten, wenn er Ihnen am meisten bedeutet.",
        takes: "1 Minute",
      },
      {
        title: "Kommt eine Benachrichtigung von der Warteliste, haben Sie sechs Stunden",
        body: "Wird ein Platz von der Buchungswarteliste frei und die Zahlung nicht innerhalb von sechs Stunden nach der Benachrichtigung abgeschlossen, wird die Buchung automatisch storniert und erstattet, und die Gelegenheit geht an die nächste Person auf der Liste. Sechs Stunden klingen großzügig, bis man bedenkt, dass die Benachrichtigung zu koreanischen Geschäftszeiten eintrifft und die meisten Leserinnen und Leser dieser Seite einen Teil davon verschlafen.",
        pitfall:
          "Ein Sechs-Stunden-Fenster, das um 3 Uhr Ihrer Zeit öffnet, ist ein Zwei-Stunden-Fenster. Rechnen Sie die Zeit der Benachrichtigung so um, wie Sie die Verkaufszeit umgerechnet haben.",
        takes: "Innerhalb von 6 Stunden",
      },
      {
        title: "Wissen Sie, dass Sie den Platz danach nicht mehr ändern können",
        body: "Ist die Reservierung abgeschlossen, sind Platzänderungen nicht möglich — der einzige Weg ist stornieren und neu buchen, was Sie der Stornogebühr der Veranstaltung aussetzt und dem Risiko, dass der Platz zwischendurch weg ist. Dasselbe gilt für Gutscheine: Ein Gutschein kann nach der Zahlung nicht mehr angewendet werden, und ihn zu nutzen bedeutet, denselben Platz zu stornieren und neu zu buchen, mit der Gebühr, die das mit sich bringt.",
        pitfall:
          "Einen Platz zu buchen, bei dem Sie unsicher sind, in der Absicht, das später zu richten. Es gibt kein Später.",
        takes: "Bevor Sie bestätigen",
      },
    ],
    faq: [
      {
        q: "Hilft Aktualisieren, schneller durch die Warteschlange von NOL World zu kommen?",
        a: "Im Gegenteil. NOL World gibt an, dass das Aktualisieren der Seite Ihre Position in der Warteschlange zurücksetzt und dass die Warteschlange nicht übersprungen werden kann.",
      },
      {
        q: "Kann ich gleichzeitig auf dem Handy und auf dem Laptop anstehen?",
        a: "Nein. Ein Konto erhält eine Wartenummer, und der Versuch, mehr zu bekommen, schließt die erste. Drücken Sie auf einem zweiten Gerät Reserve, werden Sie gefragt, ob Sie die bestehende Warteschlange behalten oder auf dem neuen Gerät von vorn beginnen wollen.",
      },
      {
        q: "Muss ich den Sitzplan aktualisieren, um neue Plätze zu sehen?",
        a: "Nein. Plätze aktualisieren sich in Echtzeit — gehaltene Plätze verschwinden und stornierte kommen ohne Neuladen zurück. Aktualisieren kostet Sie dasselbe wie das Aktualisieren der Warteschlange.",
      },
      {
        q: "Was bedeutet die Ausverkaufsquote tatsächlich?",
        a: "Sie erscheint erst, wenn 90% oder mehr der Plätze bezahlt sind, und sie zählt bezahlte Tickets und nicht Plätze, die Sie auswählen könnten. Bei stark nachgefragten Veranstaltungen gibt es eine bekannte Verzögerung zwischen der Zahl und der echten Verfügbarkeit.",
      },
      {
        q: "Wie lange habe ich nach einer Benachrichtigung von der Warteliste Zeit?",
        a: "Sechs Stunden. Wird die Zahlung in dieser Zeit nicht abgeschlossen, wird die Buchung automatisch storniert und erstattet und der Platz geht an die nächste Person auf der Warteliste.",
      },
    ],
    labels: DE_LABELS,
  },
  {
    locale: "de",
    slug: "nol-facepass-face-registration",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "NOL facepass: wer Ihr Gesicht hält, und wofür es da ist",
    summary:
      "Einmal registrieren, und eine Kamera lässt Sie ohne Ticketprüfung ein. Das Gesicht liegt bei Toss und nicht bei NOL World, es lässt sich danach nicht mehr ändern, und eine Kündigung des Dienstes löscht das Foto und behält ein Jahr lang eine getrennte Kopie.",
    scope:
      "Behandelt, was NOL World zu NOL facepass veröffentlicht, einschließlich der angegebenen Aufbewahrungsfrist nach einer Kündigung: was es tut, wer die Gesichtsdaten speichert und worauf eine Registrierung Sie festlegt. Die Unterstützung gilt je Veranstaltung, und die Veranstaltungsseite entscheidet. Nichts hier ist eine rechtliche Einschätzung zu biometrischen Daten in Ihrem eigenen Land.",
    intro: [
      "Koreanische Veranstaltungsorte gehen an der Tür zur Gesichtserkennung über, und ein Fan aus dem Ausland begegnet ihr als Kästchen während der Buchung, mit sehr wenig Erklärung auf Englisch. Die Frage darunter ist nicht klein: Ein Unternehmen, mit dem Sie nie zu tun hatten, wird gleich Ihr Gesicht halten.",
      "NOL World veröffentlicht durchaus Antworten. Sie sind konkret, sie sind beruhigender, als die meisten Unternehmen das hinbekommen, und sie gehören vor die Warteschlange gelesen statt hinein — darunter die zur Frage, was nach einer Kündigung mit den Daten geschieht, die nicht das sagt, was ein einzelnes Wort wie gelöscht nahelegt.",
    ],
    steps: [
      {
        title: "Verstehen Sie, was es ersetzt",
        body: "NOL World beschreibt facepass als Weg, Aufwand und Zeit der Identitätsprüfung beim Einlass zu verringern. Ist die Gesichtsregistrierung abgeschlossen, scannt Sie eine Kamera an der Tür und Sie betreten den Ort ohne Ticketprüfung. Es ist ein Ersatz für die Dokumentenprüfung am Eingang und keine zusätzliche Schicht darüber.",
        pitfall:
          "Es nur als Komfortfunktion zu lesen. Die zweite Hälfte der Beschreibung von NOL World ist Durchsetzung, und davon handelt der nächste Schritt.",
        takes: "2 Minuten",
      },
      {
        title: "Kennen Sie den anderen Grund, warum es existiert",
        body: "NOL World nennt den Zweck doppelt: die Identitätsprüfung zu vereinfachen und den illegalen Verkauf und Vertrieb von Tickets zu verhindern. Ein Gesicht, das zum Konto passen muss, das das Ticket gekauft hat, ist eine Weiterverkaufskontrolle, und es kommt in demselben Zeitraum wie eine Novelle des Aufführungsgesetzes, die den gewohnheitsmäßigen Weiterverkauf über Nennwert erfasst. Diese beiden Tatsachen gehören nebeneinander.",
        pitfall:
          "Anzunehmen, ein über einen Weiterverkaufsmarktplatz gekauftes Ticket funktioniere an einem facepass-Eingang schon irgendwie. Das System existiert, damit genau das nicht funktioniert.",
        takes: "2 Minuten",
      },
      {
        title: "Wissen Sie, wohin das Gesicht tatsächlich geht",
        body: "Das ist der Teil, den zu wissen sich am meisten lohnt. NOL World sagt, die Gesichtsinformationen — das Originalbild und die Merkmalsdaten — würden verschlüsselt und von Toss gespeichert, dem Fintech-Unternehmen hinter dem Dienst FaceAccess, und sie würden unter keinen Umständen an NOL World oder an Agenturen weitergegeben. Geteilt wird nur das Ergebnis der Authentifizierung, Erfolg oder Fehlschlag. NOL World sagt außerdem, die Daten würden zu keinem Zweck über die Erbringung des Dienstes hinaus verwendet, und verweist darauf, dass Toss über Zertifizierungen nach ISO 27701 und CBPR verfügt.",
        pitfall:
          "Das sind Aussagen von NOL World über einen Dritten und keine Prüfung. Sie sind für eine solche Seite ungewöhnlich konkret, was ein Grund ist, sie ernst zu nehmen, und keiner, mit dem Lesen aufzuhören.",
        takes: "5 Minuten",
      },
      {
        title: "Behandeln Sie die Registrierung als endgültig",
        body: "Ist ein Gesicht einmal registriert, lässt es sich nicht mehr ändern. NOL World nennt den Grund unumwunden — es soll die missbräuchliche Nutzung des Dienstes verhindern. Eine schlechte Registrierung lässt sich später nicht korrigieren, also sind die Bedingungen, unter denen Sie registrieren, die Bedingungen, die Sie behalten: Licht, Brille, was die Kamera eben aufgenommen hat.",
        pitfall:
          "In der Warteschlange schnell zu registrieren, bei schlechtem Licht, mit der Absicht, es später ordentlich zu wiederholen. Es gibt kein Später.",
        takes: "10 Minuten, mit Bedacht",
      },
      {
        title: "Lassen Sie niemanden auf Ihrem Telefon oder Ihrem Konto registrieren",
        body: "NOL World sagt es direkt: Stellen Sie sicher, dass niemand sonst Ihr Konto nutzt, und wenn jemand mit Ihrem Telefon oder Ihrem Konto Gesichtsinformationen registriert, haftet das Unternehmen nicht für die daraus entstehenden Probleme. Ein gemeinsam genutztes Gerät im Haushalt in dem Moment, in dem eine Tournee in den Verkauf geht, ist genau der Weg, auf dem das passiert, und das Konto ist das, was die Folge trägt.",
        pitfall:
          "Einer Freundin zu helfen, auf Ihrem angemeldeten Telefon zu registrieren. Das Gesicht, das nun an Ihrem Konto hängt, ist ihres, es lässt sich nicht ändern, und der Haftungsausschluss ist ausdrücklich.",
        takes: "1 Minute",
      },
      {
        title: "Prüfen Sie, ob Ihre Veranstaltung es überhaupt unterstützt",
        body: "Die Unterstützung gilt je Veranstaltung und nicht allgemein — NOL World führt eigens eine Frage dazu, wie man prüft, ob ein Konzert facepass unterstützt, und die existiert nur, weil die Antwort schwankt. Prüfen Sie die Veranstaltungsseite, bevor Sie den Einlass darum herum planen, und halten Sie den gewöhnlichen Weg bereit: Bestätigungsnummer und Ausweis an der Kasse.",
        pitfall:
          "Zu registrieren und dann an einem Veranstaltungsort anzukommen, der noch Dokumente prüft, während der Pass im Hotel liegt.",
        takes: "3 Minuten",
      },
      {
        title: "Lesen Sie die Antwort zur Löschung genau — es ist nicht einfach eine Löschung",
        body: "NOL World beantwortet die Frage, ob Gesichtsinformationen bei einer Kündigung gelöscht werden, und die Antwort hat zwei Hälften. Die erste: Ihr Gesichtsfoto wird beim Kündigen des Dienstes gelöscht, und eine erneute Nutzung bedeutet erneutes Registrieren. Die zweite: Zum Zweck der Identitätsprüfung werden die Daten getrennt gespeichert und ab dem Zeitpunkt der Kündigung ein Jahr lang aufbewahrt — verwendet, so NOL World, nur zur Identitätsprüfung bei einer erneuten Registrierung, und nach dem Jahr vernichtet. Eine Kündigung löscht also das Foto und startet eine Uhr, statt eine anzuhalten. Das ist eine vertretbare Regelung und es ist nicht das, was das Wort gelöscht für sich genommen nahelegt, weshalb es sich lohnt, es vor der Registrierung in ihren Worten zu lesen.",
        pitfall:
          "Die Ein-Wort-Zusammenfassung irgendeines Dritten darüber zu übernehmen, was mit biometrischen Daten geschieht, unsere eingeschlossen. Lesen Sie den Satz zur Aufbewahrung und nicht die Überschrift.",
        takes: "5 Minuten",
      },
    ],
    faq: [
      {
        q: "Sieht NOL World mein Gesicht?",
        a: "NOL World sagt nein. Gesichtsinformationen werden verschlüsselt und von Toss gehalten, und NOL World gibt an, sie würden unter keinen Umständen an NOL World oder Agenturen weitergegeben — geteilt wird nur, ob die Authentifizierung erfolgreich war oder nicht.",
      },
      {
        q: "Kann ich mein Gesicht neu registrieren, wenn der erste Versuch schlecht war?",
        a: "Nein. NOL World sagt, ein registriertes Gesicht lasse sich nicht ändern, um die missbräuchliche Nutzung des Dienstes zu verhindern. Registrieren Sie beim ersten Mal mit Bedacht.",
      },
      {
        q: "Werden meine Gesichtsdaten gelöscht, wenn ich facepass kündige?",
        a: "Teilweise, und dann mit einer Uhr. NOL World sagt, das Gesichtsfoto werde bei der Kündigung gelöscht und man müsse für eine weitere Nutzung erneut registrieren. Es sagt außerdem, dass die Daten zum Zweck der Identitätsprüfung getrennt gespeichert und ab der Kündigung ein Jahr lang aufbewahrt werden, nur zur Identitätsprüfung bei einer erneuten Registrierung verwendet und nach diesem Jahr vernichtet werden. Bis zum 20. Oktober 2026 stand auf dieser Seite, dass wir diese Antwort nicht gelesen hatten und sie nicht zusammenfassen wollten; sie ist jetzt oben zitiert und in unseren Korrekturen vermerkt.",
      },
      {
        q: "Nutzt jedes Konzert facepass?",
        a: "Nein. Die Unterstützung schwankt je Veranstaltung, und NOL World führt eine eigene Antwort dazu, wie man das prüft. Vergewissern Sie sich auf der Veranstaltungsseite Ihrer Veranstaltung und halten Sie den gewöhnlichen Abholweg bereit.",
      },
      {
        q: "Was passiert, wenn jemand anderes sein Gesicht auf meinem Konto registriert?",
        a: "NOL World sagt, das Unternehmen hafte nicht für Probleme, die daraus entstehen, und bittet Sie sicherzustellen, dass niemand sonst Ihr Konto nutzt. Da ein registriertes Gesicht nicht geändert werden kann, ist das auf gewöhnlichem Weg nicht behebbar.",
      },
    ],
    labels: DE_LABELS,
  },
  {
    locale: "de",
    slug: "nol-world-booking-fees-and-checkout-clock",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Die Kasse von NOL World: Buchungsgebühr, Uhr und die Währung, in der Sie zahlen",
    summary:
      "Ein Konzertticket trägt eine Servicegebühr von 8.000 Won, Sie haben zehn Minuten für die Platzwahl und sieben zum Bezahlen, und das Zahlungsfenster bittet Sie, eine Währung zu wählen. Drei Geldentscheidungen und eine Uhr, alle veröffentlicht und keine davon offensichtlich.",
    scope:
      "Behandelt, was NOL World zu Kosten und Zeitablauf seiner Kasse veröffentlicht: die Servicegebühr nach Genre, die zweistufige Kaufuhr, die Währungswahl, Gutscheine und Grenzen je Bestellung. Gebühren und Uhren können je Veranstaltung gesetzt werden, und NOL World sagt das in beiden Fällen, Ihre Veranstaltungsseite geht dem hier also vor. Nichts hier ist eine Empfehlung, welche Währung für Ihre konkrete Karte günstiger ist.",
    intro: [
      "Das meiste, was an einer koreanischen Kasse schiefgeht, ist nicht die Karte. Es ist, dass die Seite drei Fragen mit Geld daran stellt, während eine Uhr läuft, und eine Käuferin aus dem Ausland allem davon zum ersten Mal mit etwa sieben Minuten Restzeit begegnet.",
      "Alles davon ist veröffentlicht, und nichts davon steht auf der Produktseite, auf der Sie entschieden haben, dass das Ticket bezahlbar ist. Der Zweck dieser Seite ist also, die Überraschungen in die Woche davor zu verlegen.",
    ],
    steps: [
      {
        title: "Rechnen Sie die Servicegebühr dazu, bevor Sie das Ticket für bezahlbar halten",
        body: "NOL World veröffentlicht seine Servicegebühr nach Genre. Musicals und Konzerte tragen 8.000 Won — ausgenommen bestimmte Produkte wie Online-Konzerte und Fanclub-Mitgliedschaften. Andere Aufführungen und Sport kosten 3.000 Won. Freizeit und Ausstellungen sind kostenlos. NOL World sagt außerdem, Gebühren könnten je Produkt abweichen und seien beim Kauf zu prüfen, behandeln Sie das also als veröffentlichten Ausgangswert und nicht als Zusage zu Ihrer Veranstaltung.",
        pitfall:
          "Einen koreanischen Ticketpreis mit einem Ticketpreis zu Hause zu vergleichen und zu vergessen, dass dies obendrauf kommt. Es ist nicht viel, und es ist genau die kleine Überraschung, die eine ganze Plattform im schlechtesten Moment unglaubwürdig wirken lässt.",
        takes: "2 Minuten",
      },
      {
        title: "Wissen Sie, was die Gebühr tatsächlich kauft, denn eine Zeile davon zählt",
        body: "NOL World listet auf, was die Servicegebühr abdeckt: Wartung der Website und zugehörige Kosten, Zahlungsabwicklung einschließlich der Betrugserkennung, Technikgebühren zur Verhinderung von Buchungen durch Bots und Makros, sowie Systemunterstützung für globale Reservierungen. Der dritte Punkt ist der interessante. Die Gebühr finanziert zum Teil die Maschinerie gegen Makros, was dieselbe Durchsetzungsrichtung ist wie die Identitätsprüfungen und die Novelle des Aufführungsgesetzes — und sie ist der Grund, warum sich die Warteschlange wie ein gegnerisches System anfühlt und nicht wie eine Reihe.",
        pitfall:
          "Die Gebühr als reine Marge und die Warteschlange als Unfähigkeit zu lesen. Die Plattform sagt Ihnen, dass sie die Gebühr dafür ausgibt, automatisierte Käufer draußen zu halten, und das ist auch der Grund, warum die Regeln, die sie Ihnen auferlegt, streng sind.",
        takes: "2 Minuten",
      },
      {
        title: "Verstehen Sie die Uhr: zehn Minuten zum Wählen, sieben zum Zahlen",
        body: "Die Kaufuhr hat zwei Stufen, und NOL World nennt beide. Ab dem Betreten der Buchungsseite haben Sie bis zu zehn Minuten für die Platzwahl. Sobald Sie zum Preisschritt wechseln, werden Ihre Plätze sieben Minuten lang gehalten, während Sie die Zahlung abschließen, mit einer Uhr oben auf der Seite. Verpassen Sie sie, werden die Plätze automatisch freigegeben und Sie beginnen die Buchung von vorn. Auch Buchungen ohne Platzzuweisung oder mit freier Platzwahl bekommen die Zehn-Minuten-Grenze vor der Zahlung. NOL World ergänzt, dass die Grenzen je Veranstaltung abweichen können und manche Veranstaltungen keine haben.",
        pitfall:
          "Innerhalb der sieben Minuten die Banking-App zu öffnen, um eine Kartennummer zu suchen. Kartendaten, Rechnungsanschrift und die Freigabe-App Ihrer Bank sollten alle bereit sein, bevor Sie die Buchungsseite betreten, denn die Uhr nimmt keine Rücksicht darauf, dass Ihr Telefon Sie erneut zur Anmeldung auffordert.",
        takes: "17 Minuten, wenn Sie alles ausschöpfen",
      },
      {
        title: "Behandeln Sie die Währungsfrage als echte Entscheidung",
        body: "NOL World unterstützt die Zahlung in 24 Währungen, darunter koreanischer Won, US-Dollar, Yen und Yuan, und die verfügbaren erscheinen, nachdem Sie Ihre Kartendaten eingegeben haben. Die angebotene Wahl liegt zwischen der Währung des Ausstellungslandes Ihrer Karte und koreanischem Won. Das sind zwei verschiedene Wechselkurse, gesetzt von zwei verschiedenen Parteien — einer von demjenigen, der auf der Zahlungsseite umrechnet, einer von Ihrem Kartennetzwerk und Ihrer Bank. Die eigene Währung zu wählen ist dynamische Währungsumrechnung, und die umrechnende Partei setzt den Kurs und nimmt eine Marge darauf, also ist die Zahlung in Won meist die günstigere der beiden. Meist, nicht immer: Die Fremdwährungsgebühr Ihrer eigenen Karte fällt ohnehin an, und eine schlechte Marge Ihrer Bank kann den Abstand schließen. Die Hälfte, die Sie vor dem Tag tatsächlich prüfen können, sind die Bedingungen Ihrer Bank, prüfen Sie also die.",
        pitfall:
          "Die heimische Währung zu wählen, weil die Zahl vertraut aussieht. Vertraut ist hier häufiger die teurere Variante, und das ist der eine Bildschirm, auf dem Sie wählen, wer die Umrechnung vornimmt.",
        takes: "10 Minuten, mit Ihrer Bank, vorher",
      },
      {
        title: "Lösen Sie den Gutschein ein, bevor Sie zahlen, denn ein Danach gibt es nicht",
        body: "NOL World ist hier unumwunden: Ist die Zahlung abgeschlossen, können Sie keinen Gutschein mehr anwenden. Der einzige Weg, den es anbietet, ist, denselben Platz zu stornieren und mit angewendetem Gutschein neu zu buchen — und es warnt, dass Stornieren und Neubuchen Gebühren nach der Gebührenregelung der Veranstaltung auslösen können, prüfen Sie die also zuerst. Wägen Sie das ehrlich gegen den Wert des Gutscheins ab, und denken Sie daran, dass der freigegebene Platz während Ihrer Neubuchung nicht für Sie reserviert ist.",
        pitfall:
          "Einen Platz zu stornieren, den Sie tatsächlich haben, um einen Rabatt zu retten, den Sie vielleicht gar nicht einsetzen können. Der Gutschein ist weniger wert als das Ticket, und der Bestand wartet nicht.",
        takes: "5 Minuten",
      },
      {
        title: "Rechnen Sie mit einer Ticketgrenze, und damit, dass sie dem Veranstalter gehört",
        body: "NOL World sagt, je nach Veranstalter könne es eine Grenze geben, wie viele Tickets je Bestellung oder je Mitglied für eine Aufführung reserviert werden können — und dass bei Konzerttickets, die zusammen mit einer Tour oder anderen Eintrittskarten verkauft werden, der Veranstalter zusätzlich eine Grenze je Mitglied setzen kann. Die Obergrenze ist also keine plattformweite Zahl zum Nachschlagen; sie wird je Veranstaltung gesetzt, manchmal je Person statt je Vorgang, und sie ist ein Grund, warum eine Gruppenbestellung im letzten Schritt scheitern kann.",
        pitfall:
          "Eine Bestellung für vier Personen um eine Grenze herum zu planen, die Sie bei einer anderen Veranstaltung gelesen haben. Eine Grenze je Mitglied lässt sich auch nicht dadurch lösen, dass Sie die Bestellung über Ihre eigenen Konten aufteilen — dieses Muster steht auf der veröffentlichten Liste missbräuchlicher Nutzung von NOL World.",
        takes: "5 Minuten",
      },
      {
        title: "Bestätigen Sie, dass die Buchung existiert, an der Stelle, die den Status zeigt",
        body: "Öffnen Sie nach der Zahlung die Website oder App von NOL World und gehen Sie auf Account/My und dann My Reservations. NOL World sagt, grundlegende Reservierungsdaten und der Status seien sowohl in der Liste als auch auf der Detailseite der Buchung sichtbar. Tun Sie das einmal, solange Sie noch am Schreibtisch sitzen, statt anzunehmen, die Bestätigungsmail sei die ganze Wahrheit — die Reservierungsliste ist die Stelle, an der ein unerwarteter Status auftaucht, und es ist der Bildschirm, nach dem man Sie fragen wird, wenn Sie den Kundendienst kontaktieren.",
        pitfall:
          "Eine durchgegangene Zahlung als existierende Buchung zu behandeln. Meist ist beides dasselbe, und der ganze Sinn des Prüfens ist der Fall, in dem es das nicht ist.",
        takes: "2 Minuten",
      },
      {
        title: "Wissen Sie, was fertig für das bedeutet, was Sie gekauft haben",
        body: "Bei darstellender Kunst und Konzerten sagt NOL World, der Vorgang sei mit der Zahlung abgeschlossen und Sie holen an der Kasse des Veranstaltungsorts ab. Produkte aus Touren und Aktivitäten sind nicht einheitlich: Manche stellen einen QR- oder Barcode auf My Page oder per E-Mail aus, der direkt einlässt, und manche verlangen, dass Sie den Gutschein oder die Buchungsbestätigung an einem Schalter vor Ort gegen ein physisches Ticket eintauschen, bevor Sie eintreten. Die Anweisung von NOL World lautet, auf der Produktseite zu prüfen, welcher Fall gilt, denn der Unterschied entscheidet, ob Sie vor dem Eingang noch einen Schalter finden müssen.",
        pitfall:
          "Einen QR-Code in der E-Mail für eine Eintrittskarte zu halten. Bei einem Produkt zum Eintauschen ist er das, was Sie an einem Schalter tauschen, und der Schalter hat Öffnungszeiten.",
        takes: "5 Minuten",
      },
    ],
    faq: [
      {
        q: "Wie hoch ist die Buchungsgebühr bei einem Konzertticket?",
        a: "NOL World veröffentlicht 8.000 Won für Musicals und Konzerte, ausgenommen bestimmte Produkte wie Online-Konzerte und Fanclub-Mitgliedschaften; 3.000 Won für andere Aufführungen und Sport; und nichts für Freizeit und Ausstellungen. Es sagt außerdem, Gebühren könnten je Produkt abweichen und seien beim Kauf zu prüfen, vergewissern Sie sich also bei Ihrer eigenen Veranstaltung.",
      },
      {
        q: "Wie viel Zeit habe ich an der Kasse wirklich?",
        a: "Zehn Minuten für die Platzwahl ab dem Betreten der Buchungsseite, dann eine Haltefrist von sieben Minuten, während Sie zahlen, mit einer Uhr oben auf der Seite. Überschreiten Sie sie, werden die Plätze freigegeben und Sie fangen von vorn an. Freie Platzwahl bekommt die zehn Minuten ebenfalls. NOL World sagt, die Grenzen könnten je Veranstaltung abweichen und manche Veranstaltungen hätten keine.",
      },
      {
        q: "Soll ich in koreanischen Won oder in meiner eigenen Währung zahlen?",
        a: "Meist in Won. NOL World unterstützt 24 Währungen und lässt Sie zwischen der Währung des Ausstellungslandes Ihrer Karte und koreanischem Won wählen, angezeigt nach Eingabe der Kartendaten. Die eigene Währung zu wählen ist dynamische Währungsumrechnung, bei der die umrechnende Partei den Kurs setzt und eine Marge aufschlägt — Won ist also in der Regel günstiger. Die Fremdwährungsgebühr Ihrer eigenen Karte fällt ohnehin an, und das ist der Teil, den Sie vor dem Tag bei Ihrer Bank prüfen sollten.",
      },
      {
        q: "Ich habe meinen Gutschein vergessen. Kann ich ihn jetzt hinzufügen?",
        a: "Nein. NOL World sagt, ein Gutschein könne nach abgeschlossener Zahlung nicht mehr angewendet werden. Der einzige angebotene Weg ist, denselben Platz zu stornieren und mit dem Gutschein neu zu buchen, und es warnt, dass Stornierung und Neubuchung Gebühren nach der Regelung der Veranstaltung tragen können. Prüfen Sie die Gebühr, bevor Sie einen Platz freigeben, den Sie bereits halten.",
      },
      {
        q: "Warum kann ich nur zwei Tickets buchen, wenn meine Freundin vier gebucht hat?",
        a: "Weil die Grenze dem Veranstalter gehört und nicht der Plattform. NOL World sagt, eine Aufführung könne Tickets je Bestellung oder je Mitglied begrenzen, und dass kombinierte Produkte aus Konzert und Tour zusätzlich eine Grenze je Mitglied tragen können. Eine andere Veranstaltung oder eine andere Verkaufsrunde kann eine andere Obergrenze haben.",
      },
      {
        q: "Kann ich auf NOL World eine koreanische Kreditkarte verwenden?",
        a: "Nein. NOL World akzeptiert nur außerhalb Koreas ausgestellte Karten; in Korea ausgestellte Karten gehören verifizierten inländischen Mitgliedern auf der koreanischen Seite. Eine hier abgelehnte koreanische Karte ist die Regel, die funktioniert, und kein Fehler.",
      },
      {
        q: "Wo prüfe ich, dass meine Buchung durchgegangen ist?",
        a: "Auf der Seite oder in der App von NOL World, unter Account/My und dann My Reservations. NOL World sagt, Reservierungsdaten und Status erschienen sowohl in der Liste als auch auf der Detailseite. Dieser Bildschirm zeigt den Status, nicht die Bestätigungsmail.",
      },
      {
        q: "Ich habe gezahlt. Ist vor der Veranstaltung noch etwas zu tun?",
        a: "Bei einem Konzert- oder Theaterticket nein — NOL World sagt, der Vorgang sei abgeschlossen und Sie holen an der Kasse des Veranstaltungsorts ab. Bei einem Produkt aus Tour oder Aktivität kommt es darauf an: Manche senden einen QR- oder Barcode, der direkt einlässt, andere verlangen, dass der Gutschein zuvor an einem Schalter vor Ort gegen ein physisches Ticket getauscht wird. Welcher Fall gilt, steht auf der Produktseite.",
      },
    ],
    labels: DE_LABELS,
  },
  {
    locale: "de",
    slug: "nol-world-cancel-ticket-refund",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Ein NOL-World-Ticket stornieren: die Frist, die Gebühr und das Geld, das Sie trotzdem verlieren",
    summary:
      "Die Stornofrist ist der Nachmittag vor der Veranstaltung in koreanischer Zeit, samstags früher als an allen anderen Tagen, und ein vollständig erstattetes Ticket kann eine Karteninhaberin aus dem Ausland trotzdem Geld kosten. Außerdem: Das Ticket an eine Freundin zu senden nimmt Ihnen die Stornoschaltfläche weg.",
    scope:
      "Behandelt das Stornieren eines Veranstaltungstickets auf NOL World, so wie NOL World es dokumentiert: die Fristen, wo die Gebühr steht, wie die Erstattung auf eine ausländische Karte zurückkommt und was eine Stornierung unmöglich macht. NOL World veröffentlicht keine zentrale Gebührentabelle, und diese Seite erfindet keine. Produkte aus Touren und Aktivitäten folgen eigenen Regelungen und werden nur dort erwähnt, wo sie abweichen.",
    intro: [
      "Ein Fan aus dem Ausland storniert aus Gründen, die ein Fan im Inland selten hat: ein Visum, ein Anschlussflug, ein verschobener Dienstplan. Die Stornoregeln bedeuten diesem Publikum also mehr als dem, für das sie geschrieben wurden — und sie sind streng, an Zeitzonen gebunden und an zwei Stellen auf eine Weise unsymmetrisch, die niemand erraten würde.",
      "Zwei der Tatsachen unten gehören vor die Buchung gelesen und nicht danach. Für Veranstaltungen am Samstag schließt die Stornierung sechs Stunden früher als an jedem anderen Tag. Und eine Stornierung, die NOL World vollständig abwickelt, kann eine Karteninhaberin aus dem Ausland trotzdem Geld kosten, was niemandes Fehler ist und auch niemandes Aufgabe, für Sie zu beheben.",
    ],
    steps: [
      {
        title: "Lernen Sie die Frist vor der Buchung, denn sie ist nicht der Veranstaltungstag",
        body: "NOL World schließt Stornierungen für Veranstaltungen am Vortag und nicht am Tag selbst: 17 Uhr KST am Tag vor der Veranstaltung an Wochentagen und Feiertagen, und 11 Uhr KST am Vortag bei einer Veranstaltung am Samstag. Die Samstagsregel ist die, die Leute erwischt — sie liegt sechs Stunden früher als der Rest der Woche, und sie gilt für die Samstagsvorstellung, die Frist fällt also auf Freitagvormittag koreanischer Zeit.",
        pitfall:
          "„Den Tag davor“ in Ihrem eigenen Kalender auszurechnen. Für eine Samstagabendvorstellung in Seoul ist 11 Uhr KST am Freitag der Donnerstagabend in New York. Die Frist kann einen ganzen Tag früher liegen, als sie sich liest.",
        takes: "5 Minuten, bevor Sie zahlen",
      },
      {
        title: "Nutzen Sie das kostenlose Fenster, wenn Sie Zweifel bekommen",
        body: "Es gibt eine gebührenfreie Frist, und sie ist kurz: NOL World sagt, bei Tickets falle keine Stornogebühr an, wenn Sie bis 23:59 Uhr am Tag Ihrer Reservierung stornieren. Die Entscheidung, die Sie kostenlos rückgängig machen können, ist also die, die Sie am selben Tag treffen, an dem Sie gebucht haben. Nach Mitternacht kostet sie etwas.",
        pitfall:
          "Anzunehmen, 23:59 Uhr sei Ihre eigene Mitternacht. NOL World nennt KST bei den anderen Stornofristen ausdrücklich und bei dieser keine Zone, die sichere Lesart ist also koreanische Zeit — und ohnehin ist eine Entscheidung in den letzten zehn Minuten eines Fensters eine zu spät getroffene Entscheidung.",
        takes: "—",
      },
      {
        title: "Wissen Sie, wo die Schaltfläche ist und was es heißt, wenn sie fehlt",
        body: "Der Weg ist App oder Web, dann Account/My, dann My Reservations, dann Ticket Reservation List, dann die Reservierung, dann Cancel Reservation auf der Detailseite. Fehlt die Schaltfläche Cancel Reservation auf der Detailseite ganz, lautet die Anweisung von NOL World, den Kundendienst zu kontaktieren statt weiterzusuchen: Eine Mitarbeiterin klärt Stornierbarkeit, Gebühr und Erstattungsbetrag mit dem Anbieter und führt Sie dann. Den Vorgang verfolgen Sie auf der Detailseite der Reservierung, und nach Abschluss folgt eine Bestätigungsmail.",
        pitfall:
          "Eine fehlende Schaltfläche als Fehler der Website zu lesen und es eine Stunde lang erneut zu versuchen. Es ist ein Status, und die Uhr aus dem ersten Schritt läuft weiter, während Sie es erneut versuchen.",
        takes: "15 Minuten, plus Zeit beim Kundendienst",
      },
      {
        title: "Rechnen Sie mit keiner Gebührentabelle und holen Sie die Zahl aus Ihrer eigenen Reservierung",
        body: "Es gibt keine veröffentlichte Gebührentabelle, mit der sich planen ließe. Auf die Frage nach der Höhe der Stornogebühr antwortet NOL World mit einem Pfad — Web/App, Account/My, My Reservations, Reservation Details — weil die Zahl eine Eigenschaft Ihrer Buchung ist und nicht der Plattform. Bei Produkten aus Touren und Aktivitäten werden Gebühr und Erstattungsbetrag angezeigt, wenn Sie Cancel Reservation drücken, vor der Bestätigung. Wir drucken hier keinen Prozentsatz, dem Ihre Reservierung womöglich widerspricht.",
        pitfall:
          "Mit einer Gebührentabelle aus einem Blogbeitrag zu planen. Jede Anleitung, die einen festen koreanischen Stornoprozentsatz für Ihre Veranstaltung nennt, zitiert etwas, das NOL World nicht veröffentlicht.",
        takes: "5 Minuten",
      },
      {
        title: "Prüfen Sie die Teilstornierung, solange Sie noch buchen",
        body: "Zwei von vier Plätzen zu stornieren ist bei manchen Veranstaltungen möglich und bei anderen nicht, und die Anweisung von NOL World lautet, den Status der Teilstornierung während des Buchens zu prüfen — also bevor es das ist, was Sie brauchen. Produkte aus Touren und Aktivitäten erlauben sie überhaupt nicht: Dort heißt der Weg, die ganze Buchung zu stornieren und neu zu buchen, und NOL World warnt unumwunden, dass die Verfügbarkeit danach nicht garantiert ist und eine Neubuchung womöglich nicht möglich ist.",
        pitfall:
          "Vier Plätze in der Annahme zu buchen, die zwei unsicheren Freundinnen ließen sich später herausnehmen. Bei einer Veranstaltung ohne Teilstornierung wird daraus alle vier oder keiner.",
        takes: "2 Minuten, beim Buchen",
      },
      {
        title: "Verstehen Sie, dass eine volle Erstattung eine ausländische Karte trotzdem Geld kosten kann",
        body: "Das ist der Teil, der für dieses Publikum geschrieben ist und auf Englisch fast nie erklärt wird. NOL World gibt an, dass bei Verwendung einer ausländischen Kreditkarte ein Währungsgewinn oder -verlust entstehen kann, wegen des Unterschieds zwischen dem Wechselkurs am Buchungstag und dem am Stornotag — und, davon getrennt, dass Gebühren für Auslandstransaktionen anfallen können, obwohl die Transaktion storniert wurde. Keines von beidem ist ein Abzug, den NOL World vornimmt. Beides ist Ihr Kartenherausgeber, und der Rat von NOL World lautet, bei ihm die genauen Kurse und Gebühren zu erfragen.",
        pitfall:
          "Einen Erstattungsbetrag, der kleiner ist als der belastete, als Fehler oder versteckte Gebühr zu lesen. Die Lücke kann der Wechselkurs zwischen zwei Daten sein, und wer sie erklären kann, ist Ihre Bank und nicht die Ticketplattform.",
        takes: "Ein Anruf bei Ihrer Bank",
      },
      {
        title: "Geben Sie der Erstattung die Zeit, die das Kartennetzwerk braucht",
        body: "Hat die Transaktion Ihr Kreditkartenunternehmen noch nicht erreicht, ist die Stornierung laut NOL World sofort abgeschlossen. Hat sie es, und ist der Zahlbetrag abgerechnet, rechnen Sie mit etwa 5 bis 7 Tagen, bis das Kartenunternehmen sie zurückbucht, und damit, dass der stornierte Betrag von der Rechnung des Folgemonats abgezogen wird statt als Zahlung zurückzukommen. NOL World merkt an, dass sich die Erstattungsregeln zwischen Kartenunternehmen unterscheiden, Ihres ist also für sein eigenes Zeitmaß maßgeblich.",
        pitfall:
          "Bei Ihrer Bank eine Beanstandung zu eröffnen, während die Rückbuchung läuft. Ein Chargeback auf eine Transaktion, die ohnehin storniert wird, schafft ein zweites Problem auf einem Konto, mit dem Sie womöglich wieder buchen wollen.",
        takes: "5-7 Tage",
      },
      {
        title: "Senden Sie das mobile Ticket erst, wenn Sie sicher hingehen",
        body: "Das ist die Falle, für die die ganze Seite sich lohnt. Das Teilen mobiler Tickets erlaubt es der Käuferin, ein Ticket an die Person zu senden, die hingeht — und NOL World gibt an, dass die Stornierung der Reservierung eingeschränkt ist, sobald das mobile Ticket erfolgreich gesendet wurde. Der Weg zurück gehört der Empfängerin: Hebt sie die Registrierung des Tickets auf, wird eine Stornierung wieder möglich. Vor der Registrierung gibt es sanftere Ausgänge — die Senderin kann Cancel Send drücken, solange das Ticket nicht registriert ist, und ein nicht registriertes Ticket kommt nach 24 Stunden oder bis zum Veranstaltungsdatum automatisch zurück.",
        pitfall:
          "Tickets in der Woche der Buchung an Freundinnen zu senden, weil das ordentlich wirkt. Die Stornoschaltfläche gehört nun faktisch ihnen, und sie zurückzubekommen heißt, sie zu bitten, das Ticket zuerst aufzugeben.",
        takes: "—",
      },
      {
        title: "Lesen Sie Regelungen für Touren und Aktivitäten getrennt",
        body: "Ist Ihre Buchung eine Tour, ein Transfer oder eine Aktivität statt eines Veranstaltungstickets, ist nichts von alldem eine sichere Vorgabe. NOL World sagt, manche dieser Produkte könnten nach dem Kauf überhaupt nicht storniert werden, und dass eine Stornogebühr von 100% auch am Kauftag anfallen kann. Maßgeblich ist die Regelung auf der eigenen Detailseite des Produkts und auf dem Gutschein, und NOL World bittet Sie, sie zu lesen, bevor Sie eine Stornierung beantragen.",
        pitfall:
          "Die Ticketregeln auf ein Paket zu übertragen, das in derselben Sitzung gebucht wurde. Das kostenlose Fenster am selben Tag ist eine Regel für Veranstaltungstickets, und ein Tourprodukt kann ab dem Moment der Zahlung nicht erstattbar sein.",
        takes: "10 Minuten je Produkt",
      },
    ],
    faq: [
      {
        q: "Wie lautet die Stornofrist für eine Veranstaltung genau?",
        a: "Der Tag vor der Veranstaltung, in koreanischer Zeit. NOL World nennt 17 Uhr KST am Vortag für Wochentage und Feiertage und 11 Uhr KST am Vortag für Samstagsvorstellungen. Rechnen Sie das sorgfältig gegen Ihr eigenes Datum um — eine Frist um 11 Uhr KST am Freitag ist in weiten Teilen Amerikas der Donnerstagabend.",
      },
      {
        q: "Gibt es eine kostenlose Stornierung?",
        a: "Bei Veranstaltungstickets ja, am Tag der Buchung: NOL World sagt, eine Stornierung bis 23:59 Uhr am Tag Ihrer Reservierung trage keine Stornogebühr. Es nennt bei dieser keine Zeitzone, während es bei den anderen KST nennt, behandeln Sie sie also als koreanische Zeit und reizen Sie sie nicht aus. Produkte aus Touren und Aktivitäten sind anders — manche berechnen 100% auch am selben Tag.",
      },
      {
        q: "Wie hoch ist die Stornogebühr?",
        a: "NOL World veröffentlicht keine Tabelle. Auf diese Frage gibt es stattdessen einen Pfad — Web oder App, Account/My, My Reservations, Reservation Details — weil die Zahl zu Ihrer Buchung gehört. Bei Produkten aus Touren und Aktivitäten zeigt das Drücken von Cancel Reservation Stornogebühr und Erstattungsbetrag vor der Bestätigung. Jede englische Anleitung, die für Ihre Veranstaltung einen festen Prozentsatz nennt, zitiert eine Zahl, die die Plattform nicht angibt.",
      },
      {
        q: "Ich habe rechtzeitig storniert und weniger zurückbekommen, als ich gezahlt habe. Wo ist der Rest?",
        a: "Vermutlich nicht bei NOL World. Es gibt an, dass eine ausländische Karte einen Währungsgewinn oder -verlust aus dem Unterschied zwischen dem Kurs am Buchungstag und dem am Stornotag erzeugen kann, und dass Gebühren für Auslandstransaktionen trotz der Stornierung anfallen können. Beides liegt bei Ihrem Kartenherausgeber, und NOL Worlds eigener Rat lautet, ihn nach den genauen Kursen und Gebühren zu fragen.",
      },
      {
        q: "Wie lange dauert es, bis das Geld zurückkommt?",
        a: "Hat die Transaktion Ihr Kartenunternehmen noch nicht erreicht, ist die Stornierung sofort abgeschlossen. Hat sie es, nennt NOL World etwa 5 bis 7 Tage, bis das Kartenunternehmen die Transaktion storniert, mit Abzug des Betrags von der Rechnung des Folgemonats. Kartenunternehmen unterscheiden sich, Ihres kann es Ihnen also sagen.",
      },
      {
        q: "Ich habe das mobile Ticket schon an meine Freundin gesendet. Kann ich noch stornieren?",
        a: "Nicht, solange sie es hält. NOL World sagt, die Stornierung der Reservierung sei eingeschränkt, sobald ein mobiles Ticket erfolgreich gesendet wurde, und werde wieder möglich, wenn die Empfängerin dessen Registrierung aufhebt. Ist das Ticket noch nicht registriert, haben Sie leichtere Ausgänge: Die Senderin kann Cancel Send drücken, und ein nicht registriertes Ticket kommt nach 24 Stunden oder bis zum Veranstaltungsdatum automatisch zurück.",
      },
      {
        q: "Kann ich zwei meiner vier Plätze stornieren?",
        a: "Das hängt von der Veranstaltung ab, und der Rat von NOL World lautet, den Status der Teilstornierung beim Buchen zu prüfen und nicht dann, wenn Sie sie brauchen. Produkte aus Touren und Aktivitäten unterstützen überhaupt keine Teilstornierung — dort würden Sie die ganze Buchung stornieren und neu buchen, ohne Gewähr, dass der Bestand noch da ist.",
      },
      {
        q: "Die Schaltfläche Cancel Reservation ist auf meiner Reservierungsseite nicht da.",
        a: "NOL World behandelt das als Fall für den Kundendienst und nicht als Fehler zum erneuten Versuchen. Eine Mitarbeiterin klärt zuerst Stornierbarkeit, Gebühr und Erstattungsbetrag mit dem Anbieter. Melden Sie sich früh, denn die Frist aus der ersten Antwort läuft weiter, während Sie warten.",
      },
    ],
    labels: DE_LABELS,
  },
  {
    locale: "de",
    slug: "nol-world-mobile-ticket-and-entry",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Ihr mobiles Ticket bei NOL World: der QR-Code, die PIN und der Weg durch den Einlass",
    summary:
      "Das Ticket öffnet nur auf einem Telefon, es ist ausschließlich auf Englisch und die automatische Übersetzung Ihres Browsers verunstaltet es, ein gesendetes Ticket hat eine 24-Stunden-Uhr für die PIN, und zu spät zu kommen ist kein garantierter Einlass. Die letzten zwanzig Minuten des ganzen Vorgangs, der Reihe nach.",
    scope:
      "Behandelt das mobile Ticket von NOL World und den Einlass am Veranstaltungsort, so wie NOL World es dokumentiert: wo das Ticket öffnet, die zwei Browserzustände, die es verbergen, Senden und Empfangen mit der PIN-Uhr, die Abholung durch Dritte und das verspätete Eintreffen. Einlassregeln werden je Veranstaltung gesetzt, und der Veranstaltungsort entscheidet am Abend. Der Einlass per Gesichtserkennung ist ein eigener Ablauf mit einer eigenen Anleitung.",
    intro: [
      "Alles andere auf dieser Seite ist Vorbereitung. Das hier ist der Teil, in dem ein Flug, ein Hotel und ein Vorverkauf entweder zu einem Sitzplatz werden oder nicht, und er läuft auf einem Telefon, das Sie in einer Menge mit schlechtem Empfang halten.",
      "Das meiste, was hier schiefgeht, ist nicht dramatisch. Es ist ein Browser im falschen Modus, der einen QR-Code zeigt, wo das Ticket sein sollte, eine Übersetzungserweiterung, die eine Einlassnummer umschreibt, eine PIN, die ablief, während eine Freundin schlief. Alle vier sind von NOL World dokumentiert und alle vier sind am Abend davor vermeidbar.",
    ],
    steps: [
      {
        title: "Wissen Sie, welche Art Ticket Sie tatsächlich halten",
        body: "Die Zustellart wurde bei der Buchung entschieden, und sie bestimmt alles Weitere. Ein mobiles Ticket liegt in Ihrem Konto und wird von Ihrem Bildschirm gescannt. Abholung am Veranstaltungsort bedeutet ein Papierticket von der Kasse am Tag der Veranstaltung, und NOL World gibt diese nicht früher heraus — das Fenster öffnet eine Stunde vorher, und ein abgeholtes Ticket kann bei Verlust oder Diebstahl nicht neu ausgestellt werden. Prüfen Sie jetzt, welches Sie haben, und nicht am Veranstaltungsort.",
        pitfall:
          "Anzunehmen, jede Buchung sei ein mobiles Ticket, weil das letzte Konzert eines war. Es ist eine Eigenschaft der einzelnen Buchung, und die beiden Wege scheitern auf völlig verschiedene Weise.",
        takes: "5 Minuten",
      },
      {
        title: "Öffnen Sie das mobile Ticket auf dem Telefon, mit dem Sie hineingehen",
        body: "NOL World gibt an, dass mobile Tickets nur in der App von NOL World oder im mobilen Web verfügbar sind. Der Einlass erfolgt über den QR-Code auf dem Ticket. Der Weg auf einem Telefon ist App oder mobiles Web, anmelden, Account/My, My Reservations, dann die Schaltfläche Mobile Ticket. Auf einem Rechner erzeugt dieselbe Schaltfläche einen QR-Code, der nicht Ihr Ticket ist — er ist eine Übergabe und soll mit dem Telefon gescannt werden, damit das Ticket dort öffnet.",
        pitfall:
          "Vom Ticket einen Screenshot als Sicherung zu machen und vorzuhaben, das Bild zu zeigen. Ein Ticket, das live in einem Konto erzeugt wird, ist nicht dasselbe wie ein Bild davon, und der Einlass ist nicht die Stelle, an der Sie den Unterschied entdecken wollen.",
        takes: "10 Minuten, am Abend davor",
      },
      {
        title: "Schalten Sie die Browserübersetzung aus, bevor Sie losgehen",
        body: "NOL World sagt, mobile Tickets würden ausschließlich auf Englisch bereitgestellt, und wenn Sie andere Sprachen sehen, sei das die automatische Übersetzung Ihres Browsers — die Abhilfe ist, die Übersetzung auszuschalten und die Seite neu zu laden. Für dieses Publikum ist das der Normalzustand des Browsers und kein Sonderfall. Ein Übersetzer, der einen Einlass, einen Block oder eine Sitzreihe umschreibt, ist ein Problem, das Sie erst bemerken, wenn jemand an der Tür es Ihnen vorliest.",
        pitfall:
          "Die Übersetzung anzulassen, weil sie die ganze Reise über hilfreich war. Sie hat Ihnen koreanische Seiten übersetzt; hier ist die Seite bereits englisch, und das Einzige, was sie tun kann, ist Schaden anrichten.",
        takes: "2 Minuten",
      },
      {
        title: "Sehen Sie einen QR-Code, wo das Ticket sein sollte, stellen Sie den Browsermodus um",
        body: "Das ist die häufigste Art, wie das Ticket zu fehlen scheint, und es ist kein Fehler. NOL World sagt, wenn Ihr Browser im Desktop-Modus ist, werde statt des mobilen Tickets ein QR-Code angezeigt — und dass es unter diesem QR-Code eine Schaltfläche View Tickets gibt, die das Ticket dennoch öffnet. Andernfalls stellen Sie den Browser auf den mobilen Modus um: in Chrome über das Drei-Punkte-Menü und View as mobile version; in Safari über die Sprachschaltfläche links der Adresszeile und Request Mobile Website; in Samsung Internet über das Drei-Striche-Menü und Mobile site.",
        pitfall:
          "Jemanden am Einlass diesen QR-Code scannen zu lassen. Es ist der Übergabecode für den Rechner und nicht Ihr Einlasscode, und das, was Sie brauchen, ist eine Berührung darunter.",
        takes: "2 Minuten",
      },
      {
        title: "Verstehen Sie, worauf das Senden eines Tickets Sie festlegt",
        body: "Das Teilen mobiler Tickets geht in eine Richtung: Die Käuferin sendet an die Person, die hingeht, und NOL World gibt an, dass ein empfangenes Ticket nicht weitergesendet werden kann — nur gebuchte Tickets lassen sich senden. Das Senden bleibt bis zum Tag der Veranstaltung möglich. Nicht jedes Produkt bietet es an; wo der Verkäufer es zurückgehalten hat, ist die Schaltfläche zum Senden schlicht nicht da. Und der Preis des Sendens ist Ihr eigener Ausgang: Sobald ein Ticket erfolgreich gesendet wurde, schränkt NOL World die Stornierung der Reservierung ein, die erst wiederhergestellt wird, wenn die Empfängerin die Registrierung aufhebt.",
        pitfall:
          "Eine Gruppe zu organisieren, indem Sie in der Woche der Buchung allen ihr Ticket senden. Sie haben jeder Person gerade ein Vetorecht gegen die Stornierung dieser Reservierung gegeben.",
        takes: "5 Minuten",
      },
      {
        title: "Wenn Sie ein Ticket empfangen, behandeln Sie die PIN als 24-Stunden-Uhr",
        body: "Ein empfangenes Ticket ist erst nutzbar, wenn es registriert ist, und das Fenster ist kurz. NOL World sagt, die PIN könne nur innerhalb von 24 Stunden nach dem Senden registriert werden, und ein nicht registriertes Ticket gehe danach an die Senderin zurück — oder wenn es bis zum Veranstaltungsdatum nicht registriert wurde. Die Registrierung läuft über die URL in der Nachricht oder E-Mail: Received Mobile Ticket, Ticket Register, dann die PIN aus der Nachricht. Danach liegt das Ticket unter My Page, Received Mobile Ticket, Booking History. Zurückgeben läuft über denselben Weg mit der Schaltfläche Return, und NOL World sagt, ein registriertes Ticket lasse sich weiterhin zurückgeben.",
        pitfall:
          "An eine Freundin in einer Zeitzone zu senden, in der diese 24 Stunden überwiegend Nacht sind. Das Ticket kommt still zu Ihnen zurück und die Reservierung gehört wieder Ihnen, was am Dienstag in Ordnung ist und am Morgen der Veranstaltung nicht.",
        takes: "5 Minuten, innerhalb von 24 Stunden",
      },
      {
        title: "Prüfen Sie die Veranstaltungsseite, bevor Sie annehmen, jemand anderes könne für Sie abholen",
        body: "NOL World erlaubt die Abholung durch Nichtkäufer durchaus, mit echten Bedingungen daran. Der Ablauf unterscheidet sich je Veranstaltungsort, die Abholung durch Dritte kann je nach Art der Veranstaltung eingeschränkt sein, und die Anweisung von NOL World lautet, den Hinweis auf der Detailseite der gebuchten Veranstaltung zu prüfen. Was die andere Person braucht, sind die aus My Ticket ausgedruckten Buchungsdaten, die Bestätigungsnummer und ein Ausweis der Käuferin. Behandeln Sie diese letzte Anforderung als die Grenze, die sie ist: Bei einer Veranstaltung, deren Einlass an der verifizierten Identität der Käuferin hängt, planen Sie nicht mit einer Vertretung.",
        pitfall:
          "Die Abholung durch Dritte als allgemeines Recht zu lesen. Sie ist eine Erlaubnis je Veranstaltungsort und je Veranstaltung, und die Veranstaltungen, die sie am ehesten verweigern, sind genau die stark nachgefragten, für die Sie einen Vorverkauf brauchten.",
        takes: "10 Minuten",
      },
      {
        title: "Behandeln Sie verspätetes Eintreffen nicht als Platz, den Sie noch haben",
        body: "NOL World sagt ausdrücklich, dass der Einlass nach Beginn von der Veranstaltung abhängt und manche Aufführungen ihn gar nicht erlauben — namentlich klassische Konzerte und Opern. Wo es den späten Einlass gibt, kann er bedeuten, auf die Pause zu warten und die zweite Hälfte zu sehen. Und selbst wenn Sie hereingelassen werden, sagt NOL World, dass Sie Ihren Platz womöglich erst in der Pause einnehmen können, ein verspätetes Eintreffen kann also heißen, durch genau den Teil, für den Sie gekommen sind, zu stehen oder woanders zu sitzen.",
        pitfall:
          "Die Ankunftszeit vom Beginn her zu planen. Planen Sie sie von der Einlassschlange, der Sicherheitskontrolle und dem Abholfenster her, die alle vor dem Beginn stattfinden und von denen keines wartet.",
        takes: "—",
      },
    ],
    faq: [
      {
        q: "Da ist ein QR-Code, wo mein Ticket sein sollte. Ist meine Buchung kaputt?",
        a: "Nein — Ihr Browser ist im Desktop-Modus. NOL World sagt, das erzeuge einen QR-Code anstelle des mobilen Tickets, und dass eine Schaltfläche View Tickets darunter das Ticket öffnet. Sie können den Browser auch auf den mobilen Modus umstellen: Das Drei-Punkte-Menü von Chrome hat View as mobile version, die Sprachschaltfläche von Safari bietet Request Mobile Website, und das Drei-Striche-Menü von Samsung Internet hat Mobile site.",
      },
      {
        q: "Mein mobiles Ticket wird in der falschen Sprache angezeigt.",
        a: "NOL World stellt mobile Tickets ausschließlich auf Englisch bereit, eine andere Sprache bedeutet also, dass Ihr Browser automatisch übersetzt. Schalten Sie die Übersetzung aus und laden Sie neu. Das sollte man vor der Reise erledigen und nicht am Einlass, denn eine übersetzte Einlassnummer oder Sitzreihe ist auf eine schwer erkennbare Weise falsch.",
      },
      {
        q: "Kann ich das Ticket an der Tür von meinem Laptop zeigen?",
        a: "NOL World sagt, mobile Tickets seien nur in der App oder im mobilen Web verfügbar. Auf einem Rechner gibt Ihnen die Schaltfläche Mobile Ticket einen QR-Code zum Scannen mit dem Telefon, auf dem dann das eigentliche Ticket öffnet. Planen Sie den Einlass mit einem Telefon.",
      },
      {
        q: "Kann meine Freundin meine Tickets an der Kasse abholen?",
        a: "Manchmal. NOL World sagt, Nichtkäufer könnten abholen, dass der Ablauf aber je Veranstaltungsort abweicht und die Abholung durch Dritte je nach Art der Veranstaltung eingeschränkt sein kann — maßgeblich ist also der Hinweis auf der Detailseite Ihrer Veranstaltung. Sie bräuchte die aus My Ticket ausgedruckten Buchungsdaten, die Bestätigungsnummer und einen Ausweis der Käuferin. Bei Veranstaltungen, die die Identität der Käuferin am Einlass prüfen, verlassen Sie sich nicht darauf.",
      },
      {
        q: "Ich habe ein mobiles Ticket versehentlich gesendet. Kann ich es zurückholen?",
        a: "Wenn die Empfängerin es noch nicht registriert hat, ja — NOL World sagt, die Senderin könne das Teilen mit der Schaltfläche Cancel Send abbrechen. Es kommt auch automatisch zurück, wenn die Empfängerin es nicht innerhalb von 24 Stunden oder bis zum Veranstaltungsdatum registriert. Nach der Registrierung ist die Rückgabe ihre Handlung: Sie gibt es über My Page, Received Mobile Ticket, Booking History, Mobile Ticket, Return zurück.",
      },
      {
        q: "Was passiert, wenn meine Freundin das gesendete Ticket nie registriert?",
        a: "Es kommt zu Ihnen zurück. NOL World sagt, ein nicht registriertes Ticket werde nach 24 Stunden automatisch an die Senderin zurückgegeben, oder wenn es bis zum Veranstaltungsdatum nicht registriert wurde. Das stellt Ihre Reservierung wieder her — nach den Stornoregeln einschließlich Ihrer Möglichkeit, sie zu stornieren — aber es ist ein stiller Vorgang, prüfen Sie es also, statt es anzunehmen.",
      },
      {
        q: "Ich komme zwanzig Minuten zu spät. Lassen sie mich rein?",
        a: "Das hängt von der Veranstaltung ab und niemand kann es zusagen. NOL World sagt, der Einlass nach Beginn hänge von der Aufführung ab und manche erlaubten ihn gar nicht, klassische Konzerte und Opern besonders; wo er erlaubt ist, müssen Sie womöglich auf die Pause warten, und bis dahin können Sie Ihren eigenen Platz womöglich nicht einnehmen.",
      },
      {
        q: "Ist das mobile Ticket dasselbe wie der Einlass per Gesichtserkennung?",
        a: "Nein. NOL facepass ist ein eigenes System, bei dem eine Kamera an der Tür Sie ohne Ticketprüfung einlässt, und die Unterstützung dafür wird je Veranstaltung gesetzt. Das mobile Ticket und sein QR-Code sind der gewöhnliche Weg, und der, den man funktionsfähig halten sollte, auch wenn man ein Gesicht registriert hat.",
      },
    ],
    labels: DE_LABELS,
  },
  {
    locale: "de",
    slug: "nol-world-play-stay-package",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "NOL World Play&Stay: ein Produkt, und fast nichts daran ist änderbar",
    summary:
      "Ein Konzert und ein Hotel, verkauft als ein einziger Posten. Sie können Hotel, Daten und Nächte nicht ändern, auf das Hotel zu verzichten erstattet nichts, der Platz ist zufällig und wird am Tag selbst verraten, und die Tickets werden nur Ihnen persönlich im Hotel innerhalb eines Zeitfensters ausgehändigt.",
    scope:
      "Behandelt die Pakete aus Konzert und Hotel namens Play and Stay von NOL World, so wie NOL World sie dokumentiert: was feststeht, wie Tickets abgeholt werden, welche Anforderungen an Identität und Namen gelten, und was die Antworten zur Stornierung tatsächlich sagen. Einzelne Pakete tragen eigene Stornoregelungen und Leistungen, und die Produktseite ist maßgeblich. Ein Shuttle wird nur dort erwähnt, wo ein Paket eines enthält.",
    intro: [
      "Ein Paket sieht nach der bequemen Lösung aus: eine Zahlung, ein Hotel in der Nähe des Veranstaltungsorts, eine zugesicherte Platzkategorie, kein Kampf mit einer Warteschlange. Für einen Fan aus dem Ausland mit einem einzigen Anlauf für eine Reise ist das ein ehrlich attraktiver Tausch.",
      "Es ist zugleich das starrste Produkt der Plattform, und die Starrheit ist aus dem Angebot nicht ersichtlich. Liest man NOL Worlds eigene Antworten hintereinander, zeigt sich ein Muster: Das Paket ist ein unteilbarer Posten. Nicht ein Ticket und ein Hotelzimmer, die sich getrennt optimieren lassen — eine Sache, einmal gekauft, fast nirgends änderbar. Alles Folgende ergibt sich aus dieser einen Tatsache, auch die Teile, die unfair wirken werden, wenn Sie sie brauchen.",
    ],
    steps: [
      {
        title: "Verstehen Sie, dass Sie einen Posten kaufen und nicht zwei Buchungen",
        body: "Das ist die ganze Anleitung in einem Schritt. NOL World gibt an, dass die Anzahl der Nächte in einem Paket nicht geändert werden kann, dass die im Paket angegebenen Daten für Anreise und Abreise nicht geändert werden können, und dass ein Hotelwechsel nicht zulässig ist. Nächte lassen sich auch beim Kauf nicht hinzufügen — ein längerer Aufenthalt ist ein eigenes Gespräch mit dem Hotel, zum Preis des Hotels und abhängig von dessen Verfügbarkeit. Und ein Konto kann einen Posten kaufen, das ist also nichts, was man stapelt.",
        pitfall:
          "Das Paket zu buchen mit der Absicht, die Einzelheiten später zu ordnen: einen Tag früher anreisen, in ein Hotel näher bei einer Freundin wechseln, hinten eine Nacht streichen. Jedes davon ist ein dokumentiertes Nein.",
        takes: "15 Minuten, bevor Sie zahlen",
      },
      {
        title: "Nehmen Sie hin, dass der Verzicht auf das Hotel nichts erstattet",
        body: "Die Frage wird in der FAQ von NOL World auf zwei Arten gestellt und bekommt beide Male dieselbe Antwort: Sie dürfen sich entscheiden, nicht im Hotel zu übernachten, aber eine Erstattung des Hotelanteils gibt es nicht, und die Reservierung ist nicht auf eine andere Person übertragbar. Stattdessen bei einer Freundin zu übernachten verwandelt sich also nicht in Geld zurück, und das bezahlte Zimmer kann niemandem sonst übergeben werden. Eine Nacht zu nutzen und den Rest zurückzufordern wird ebenfalls abgelehnt — die Anzahl der Nächte steht fest.",
        pitfall:
          "Die Hotelhälfte als Anzahlung zu behandeln, von der man weggehen kann. Es ist die Hälfte, die Sie nicht weiterverkaufen, nicht verschenken und nicht zurückfordern können.",
        takes: "—",
      },
      {
        title: "Rechnen Sie mit einem zufälligen Platz, und damit, ihn am Tag selbst zu erfahren",
        body: "Das Paket sichert eine Kategorie zu, keinen Ort. NOL World sagt, die Platzvergabe innerhalb von Abschnitten und Zonen erfolge, abgesehen von Ihrer gewählten Kategorie, zufällig — und dass Ihre Platzzuweisung beim Abholen des Tickets im Hotel am Tag der Aufführung gezeigt wird. Sie werden erst Stunden vor der Veranstaltung wissen, wo Sie sitzen. Es schließt auch die naheliegende Rückfrage: Unzufriedenheit mit dem Platz ist kein Erstattungsgrund, und eine Stornogebühr kann trotzdem anfallen.",
        pitfall:
          "Mit einer Platzposition zu planen — einer bestimmten Seite für ein Fanprojekt, einer Reihe für ein Objektiv. Die Kategorie ist das Versprechen; der Rest ist eine Ziehung, die Sie am Tag selbst sehen.",
        takes: "—",
      },
      {
        title: "Holen Sie am Hotelschalter ab, persönlich, innerhalb des Fensters",
        body: "Es gibt genau einen Weg zu diesen Tickets. NOL World sagt, die Abholung erfolge nur am Ticketschalter von NOL World im Hotel, nur während der festgelegten Zeiten, und dass Tickets ausschließlich an die Person ausgegeben werden, auf die die Reservierung läuft, und von dieser persönlich abzuholen sind. Auf die Frage, ob jemand mit Anspruch auf eine Ermäßigung stattdessen abholen und hingehen könne, lautet die Antwort, dass Tickets nur von der Reservierungsinhaberin abgeholt und genutzt werden können, ohne Ausnahme. Verpasst man die festgelegten Zeiten, lautet die veröffentlichte Antwort schlicht, dass Tickets nur während der angegebenen Zeit verfügbar sind.",
        pitfall:
          "Den Tag um den Veranstaltungsort herum zu planen. Der verbindliche Termin ist am Hotelschalter, in einem Fenster, das jemand anderes gesetzt hat, am Tag der Veranstaltung.",
        takes: "Bauen Sie den Tag darum herum",
      },
      {
        title: "Bringen Sie die Dokumente mit, die der Schalter tatsächlich verlangt",
        body: "NOL World ist konkret: den gültigen Originalausweis der Reservierungsinhaberin, dazu die Reservierungsbestätigung, ausgedruckt oder auf dem Telefon — und ohne diese können Tickets nicht abgeholt werden. Für Staatsangehörige außerhalb Koreas ist der akzeptierte Ausweis ein Pass oder eine Bescheinigung über die Registrierung als Ausländerin. Für koreanische Staatsangehörige gibt es eine längere Liste, darunter Personalausweis, Führerschein, Pass, Jugendausweis oder ein mobiler Ausweis, ausgestellt über Government 24 oder PASS.",
        pitfall:
          "Den Pass im Zimmersafe zu lassen, weil der Schalter im selben Gebäude ist. Es ist der Originalausweis, der das Ticket öffnet, und ein Foto davon steht nicht auf der Liste.",
        takes: "5 Minuten beim Packen",
      },
      {
        title: "Bei einem Paket für zwei müssen Sie beide am Schalter sein",
        body: "Das ordnet einen Tag um und wird leicht übersehen. NOL World sagt, bei einem Paket für zwei Personen müssten sowohl die Reservierungsinhaberin als auch die Begleitperson zur Abholung anwesend sein — und dass auch die Begleitperson einen Ausweis vorzeigen muss, damit bestätigt werden kann, dass sie die Altersanforderung für den Einlass erfüllt. Das Abholfenster ist also ein Termin für zwei Personen mit zwei Ausweisen und keine Besorgung, die eine von Ihnen erledigen kann.",
        pitfall:
          "Sich am Tag aufzuteilen — eine holt die Tickets, die andere macht Sightseeing oder stellt sich für Merchandise an. Der Schalter gibt die Tickets nicht an eine von Ihnen heraus.",
        takes: "—",
      },
      {
        title: "Bringen Sie den Namen jetzt genau mit dem Pass in Übereinstimmung",
        body: "NOL World beantwortet das mit beiden Folgen in einem Satz: Stimmt der bei der Buchung angegebene Name nicht mit Ihrem Pass überein, sind weder die Ticketabholung noch der Hotel-Check-in möglich. Beide Hälften des Pakets, blockiert durch denselben Fehler. Die Frage, auf die es antwortet, nennt die üblichen Verdächtigen — ein Tippfehler, ein fehlender zweiter Vorname, Groß- und Kleinschreibung, Leerzeichen. Prüfen Sie die Buchung gegen die Passseite selbst und nicht gegen Ihre Erinnerung.",
        pitfall:
          "Anzunehmen, ein kleiner Unterschied werde durchgewunken, weil das Paket schon bezahlt ist. Bezahlt ist nicht das, was an einem der beiden Schalter geprüft wird.",
        takes: "10 Minuten",
      },
      {
        title: "Warten Sie nicht auf eine Hotelbestätigung per E-Mail, denn es gibt keine",
        body: "Das verursacht vermeidbare Panik, wissen Sie es also vorher. NOL World sagt, Hotelbestätigungen würden nicht gesondert versandt, und dass die Hotelreservierung bestätigt und gültig ist, wenn die Zahlung durchging. Noch nützlicher: Die Reservierungsdaten gehen erst etwa zwei Wochen vor dem Aufenthalt an das Hotel, das Hotel kann Sie vorher also wirklich nicht finden. Rufen Sie früher an und man hat nie von Ihnen gehört, ist das der dokumentierte Normalzustand.",
        pitfall:
          "Ein Ersatzzimmer zu buchen oder das Paket erneut zu kaufen, weil das Hotel sechs Wochen vorher keine Reservierung findet. Es war nichts falsch, und jetzt gibt es zwei Buchungen.",
        takes: "2 Minuten Beruhigung",
      },
      {
        title: "Checken Sie als Käuferin ein, und lesen Sie die kleinen Leistungen",
        body: "Der Hotel-Check-in hängt an derselben Person wie die Tickets: NOL World sagt, der Check-in sei nur nach Prüfung der Identität der Reservierungsinhaberin möglich, eine Begleitperson kann also nicht zuerst einchecken und warten. Kommen Sie spät an, lautet die Anweisung, das Hotel vorab zu kontaktieren — mit der Warnung, dass es je nach Hotel womöglich nicht möglich ist. Zwei weitere Einzelheiten, die vor der Buchung zu kennen sich lohnt: Minderjährige können nicht ohne Erziehungsberechtigte übernachten, und Frühstück ist nicht enthalten, sofern Ihr konkretes Paket es nicht enthält.",
        pitfall:
          "Eine Freundin vorauszuschicken, damit sie das Gepäck abstellt und den Aufenthalt beginnt. Das Zimmer öffnet sich auf Ihre Identität und nicht auf die Buchungsnummer.",
        takes: "—",
      },
      {
        title: "Gibt es ein Shuttle, behandeln Sie es als eine Abfahrt ohne zweite Chance",
        body: "Wo ein Paket ein Shuttle enthält, sind die Antworten von NOL World nüchtern. Die Nutzung ist freiwillig, und es nicht zu nutzen erstattet nichts. Es gibt keine Ersatzfahrzeuge, zu spät am Abfahrtsort zu sein heißt also, dass es weg ist. Ein Shuttle nur für die Rückfahrt ist möglich. Eine Begleitperson, die nicht gebucht hat, kann die Shuttle-Leitung vor Ort fragen, aber die Plätze sind begrenzt und nicht zugesichert. Und die Einzelheit, die einen Abend ruiniert: Sie dürfen einen Koffer in den Bus mitnehmen, aber eine Gepäckaufbewahrung im Bus gibt es nicht, sobald Sie am Veranstaltungsort angekommen sind. Ort und Zeit für das Einsteigen zur Rückfahrt bekommen Sie bei der Ticketübergabe im Hotel.",
        pitfall:
          "Einen Koffer zum Konzert mitzunehmen, weil der Bus ihn zugelassen hat. Am Veranstaltungsort gibt es nirgends, wo man ihn lassen könnte, und Sie tragen ihn durch die Veranstaltung.",
        takes: "—",
      },
      {
        title: "Lesen Sie die Antworten zur Stornierung vor der Buchung, denn sie lauten nein",
        body: "Das ist der Schritt, den man ernst nehmen sollte, solange die Reise noch ein Plan ist. NOL World veröffentlicht Antworten auf die zwei härtesten Fälle, und beide sind Absagen. Zur Ansteckung: Nach der Herabstufung der Risikoeinstufung von COVID-19 ist eine Quarantäne nicht mehr verpflichtend, dementsprechend gilt auch bei einer Infektion keine Minderung der Stornogebühr. Zu Todesfall und Krankenhausaufenthalt nach einem Unfall: Erstattungen aus persönlichen Gründen gibt es nicht, und Stornogebühren fallen nach der jeweiligen Regelung des Produkts an. Ob sich das hart oder nur klar liest, es sagt Ihnen, wo das Risiko liegt — bei Ihnen, ab dem Moment der Zahlung. Das Instrument, das es tragen soll, ist eine vor der Abreise abgeschlossene Reiseversicherung, und was sie tatsächlich abdeckt, hängt von der Police ab, lesen Sie dieses Dokument also, statt es anzunehmen.",
        pitfall:
          "Das Risiko unversichert zu tragen in der Annahme, ein hinreichend ernster Grund werde schon akzeptiert. NOL World hat seine Antwort auf die zwei ernstesten Gründe, die es gibt, bereits veröffentlicht.",
        takes: "30 Minuten mit einer Versicherungspolice",
      },
    ],
    faq: [
      {
        q: "Kann ich das Paket kaufen und das Hotel nicht nutzen?",
        a: "Sie können auf die Übernachtung verzichten, aber NOL World gibt an, dass der Hotelanteil nicht erstattungsfähig ist und die Reservierung nicht auf eine andere Person übertragen werden kann. Weniger Nächte zu nutzen, als das Paket enthält, und die Differenz zurückzufordern wird ebenfalls abgelehnt, weil die Anzahl der Nächte nicht geändert werden kann.",
      },
      {
        q: "Kann ich den Aufenthalt verlängern, verkürzen, die Daten verschieben oder das Hotel wechseln?",
        a: "Nächte können nicht geändert werden, die Daten für Anreise und Abreise im Paket können nicht geändert werden, und ein Hotelwechsel ist nicht zulässig. Zusätzliche Nächte lassen sich auch beim Kauf nicht hinzufügen — die Anweisung von NOL World lautet, sich wegen Verfügbarkeit und Preis direkt an das Hotel zu wenden, und es kann sein, dass es nicht möglich ist. Ein Zimmer-Upgrade ist dasselbe: beim Hotel fragen und bei Ankunft direkt dort zahlen.",
      },
      {
        q: "Wann erfahre ich meinen Platz?",
        a: "Wenn Sie das Ticket am Tag der Aufführung im Hotel abholen. Das Paket sichert eine Kategorie zu; innerhalb dieser Kategorie vergibt NOL World Abschnitte und Plätze zufällig. Mit dem Ergebnis unzufrieden zu sein ist kein Erstattungsgrund.",
      },
      {
        q: "Kann jemand die Tickets für mich abholen oder an meiner Stelle hingehen?",
        a: "Nein. NOL World sagt, Tickets würden ausschließlich an die Reservierungsinhaberin ausgegeben und müssten persönlich abgeholt werden, und dass sie nur von der Reservierungsinhaberin abgeholt und genutzt werden können, ohne Ausnahme. Bei einem Paket für zwei müssen beide Personen am Schalter sein, und die Begleitperson muss ebenfalls einen Ausweis zeigen, damit ihr Alter bestätigt werden kann.",
      },
      {
        q: "Ich habe keine Hotelbestätigung per E-Mail bekommen.",
        a: "Es gibt keine. NOL World sagt, Hotelbestätigungen würden nicht gesondert versandt, und dass eine erfolgreiche Zahlung bedeutet, dass die Hotelreservierung bestätigt ist. Es sagt außerdem, die Reservierungsdaten erreichten das Hotel erst etwa zwei Wochen vor der Anreise, eine direkte Bestätigung ist also erst danach möglich.",
      },
      {
        q: "Ich habe das Hotel angerufen und man findet meine Buchung nicht.",
        a: "Zu erwarten, wenn Sie früh angerufen haben. NOL World sagt, die Daten würden etwa zwei Wochen vor dem Aufenthalt an das Hotel gesendet und eine Bestätigung sei erst danach möglich, und dass eine ordnungsgemäß abgeschlossene Paketreservierung mit Zahlung bedeutet, dass die Hotelbuchung sicher ist. Buchen Sie nicht erneut.",
      },
      {
        q: "Ich wurde positiv getestet oder hatte einen Notfall in der Familie. Wird die Stornogebühr erlassen?",
        a: "Die veröffentlichte Antwort von NOL World lautet in beiden Fällen nein. Es sagt, da eine Quarantäne wegen COVID-19 nicht mehr verpflichtend ist, gelte auch bei einer Infektion keine Minderung der Stornogebühr; und dass Erstattungen aus persönlichen Gründen, einschließlich Todesfall oder Krankenhausaufenthalt nach einem Unfall, nicht möglich sind, wobei Gebühren nach der Regelung des jeweiligen Produkts anfallen. Eine vor der Reise abgeschlossene Reiseversicherung ist das Mittel für dieses Risiko — was sie abdeckt, hängt von der Police ab, lesen Sie sie also.",
      },
      {
        q: "Muss ich das Shuttle nutzen, und kann ich einen Koffer mitnehmen?",
        a: "Es ist freiwillig, und es nicht zu nutzen erstattet nichts. Ein Koffer darf in den Bus, aber NOL World warnt, dass es im Bus keine Gepäckaufbewahrung gibt, sobald Sie den Veranstaltungsort erreichen — ein mitgebrachter Koffer ist also ein getragener Koffer. Ersatzfahrzeuge gibt es nicht, wenn Sie die Abfahrt verpassen, und Ort und Zeit für das Einsteigen zur Rückfahrt werden mit den Tickets im Hotel ausgegeben.",
      },
    ],
    labels: DE_LABELS,
  },
  {
    locale: "de",
    slug: "nol-world-account-recovery-and-booking-errors",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Aus NOL World ausgesperrt: das Konto finden und Seiten reparieren, die nicht aufgehen",
    summary:
      "Die Anmeldeart, die Sie gewählt haben, bestimmt jeden Weg zur Wiederherstellung, ein Zurücksetzen des Passworts gibt es nur für die Registrierung per E-Mail, und eine nicht bestätigte E-Mail-Adresse kann ein Konto überhaupt schwer auffindbar machen. Dazu Fehler auf der Buchungsseite, die gar keine Fehler sind.",
    scope:
      "Behandelt die von NOL World dokumentierte Wiederherstellung und Löschung von Konten sowie die Fehlschläge auf der Buchungsseite: Anforderungen an Browser und App, den Sitzplan auf dem Telefon, und Hinweisfenster, die wie ein Defekt aussehen. Die Mechanik der Warteschlange hat eine eigene Anleitung. Nichts hier hilft irgendjemandem in ein Konto, das ihm nicht gehört.",
    intro: [
      "Zwei Dinge gehen auf einer Ticketseite schief, die mit Tickets überhaupt nichts zu tun haben. Entweder Sie kommen nicht in Ihr Konto, oder die Seite tut schlicht nicht, was sie soll — und beides passiert am Morgen des Verkaufs, wenn keine Zeit bleibt, irgendetwas zu lesen.",
      "Fast alles davon entscheidet eine einzige Wahl, die Sie Monate vorher ohne Nachdenken getroffen haben: ob Sie sich mit einer E-Mail-Adresse registriert haben oder über Google, Apple oder Line. Diese eine Tatsache bestimmt, ob es ein Zurücksetzen des Passworts für Sie überhaupt gibt, und deshalb fängt es dort an.",
    ],
    steps: [
      {
        title: "Finden Sie heraus, welche Art von Anmeldung Sie tatsächlich haben",
        body: "Ein Konto bei NOL World entsteht mit einer E-Mail-Adresse oder über die Anmeldung bei einem anderen Dienst — Google, Apple oder Line, unter anderem. Die Folge ist schärfer, als es klingt: NOL World gibt an, dass die Wiederherstellung des Passworts nur Nutzerinnen und Nutzern offensteht, die sich mit einer E-Mail-Adresse registriert haben. Nutzen Sie die Anmeldung über einen anderen Dienst, gibt es kein Passwort bei NOL World zum Zurücksetzen, weil es nie eines gab. Finden Sie jetzt heraus, welches von beidem Sie sind, solange nichts drängt.",
        pitfall:
          "Zu glauben, Sie hätten ein E-Mail-Konto, weil Sie sich erinnern, eine E-Mail-Adresse eingetippt zu haben. Die Anmeldung über einen anderen Dienst zeigt Ihre Adresse ebenfalls an, und der Weg zur Wiederherstellung ist ein völlig anderer.",
        takes: "5 Minuten",
      },
      {
        title: "Bestätigen Sie Ihre E-Mail-Adresse, denn das ist der Schritt, der sich nicht nachholen lässt",
        body: "Der Schlusssatz von NOL World zur Wiederherstellung von Konten ist der wichtigste in diesem Bereich: Ein Konto, dessen E-Mail-Adresse nicht bestätigt wurde, kann schwer auffindbar sein. Alles andere hier ist ein Verfahren mit einem Ergebnis. Das hier ist eine Tür, die sich womöglich nicht öffnet — der Kundendienst gleicht Sie mit einem Datensatz ab, und eine bestätigte E-Mail-Adresse ist die stärkste Übereinstimmung, die er hat. Lesen Sie das mit einem funktionierenden Konto, prüfen Sie, dass dessen Adresse bestätigt ist, und lassen Sie es dabei.",
        pitfall:
          "Die Bestätigungsmail bei der Registrierung zu überspringen, weil ein Verkauf drängte. Das hat an jenem Tag nichts gekostet und es ist der Unterschied zwischen einem wiederherstellbaren und einem verlorenen Konto.",
        takes: "3 Minuten, jetzt",
      },
      {
        title: "Bei einer Anmeldung über einen anderen Dienst prüfen Sie zuerst dort",
        body: "Wenn Sie nicht mehr wissen, ob Sie je ein Konto bei NOL World hatten, weiß es der Anbieter. NOL World veröffentlicht, wo man nachsieht: bei Google über das Google-Konto, dann Sicherheit, dann Ihre Verbindungen zu Apps und Diensten von Drittanbietern. Bei Apple über Settings, Ihren Namen und die Apple-ID, dann Sign-In & Security, dann Sign in with Apple. Bei Line über Settings, dann Konto, dann die zugelassenen Apps. Steht NOL World dort, existiert das Konto und Sie wissen, welcher Anbieter es öffnet.",
        pitfall:
          "Auf der Anmeldeseite jede Dienstschaltfläche der Reihe nach auszuprobieren, um zu sehen, welche funktioniert. Das kann ein zweites Konto anlegen, statt das erste zu finden, und nun gibt es zwei — in einem davon liegen Ihre Buchungen.",
        takes: "10 Minuten",
      },
      {
        title: "Scheitert das, senden Sie die fünf Angaben, die der Kundendienst verlangt",
        body: "NOL World sucht das Konto, und es nennt, was es dafür braucht: die E-Mail-Adresse, die Sie verwendet haben könnten, die Art der Anmeldung (Google, Line, Apple oder E-Mail), Ihren Anzeigenamen sowie die Art des gebuchten Produkts samt Buchungsnummer. Es sagt auch, wo Letztere steht — die Buchungsnummer liegt in dem Gutschein, der Ihnen bei der Buchung per E-Mail geschickt wurde. Sammeln Sie alles, bevor Sie schreiben, denn eine Anfrage ohne Buchungsnummer ist eine Anfrage, die um Raten bittet.",
        pitfall:
          "Alte Bestätigungsmails zu Buchungen als Ballast zu löschen. Darin steht die Buchungsnummer, und die ist das stärkste Erkennungsmerkmal, das Sie anbieten können, wenn das Verlorene gerade das Konto selbst ist.",
        takes: "20 Minuten",
      },
      {
        title: "Ein neues Telefon löscht Ihre Buchungen nicht — ein anderes Konto schon",
        body: "Das ist die häufigste falsche Sorge, und NOL World beantwortet sie unumwunden: Das Telefon zu wechseln oder sich erneut anzumelden löscht Ihren Verlauf nicht. Worum es Sie bittet, ist zu prüfen, ob Sie mit einem anderen Konto angemeldet sind als ursprünglich. Das ist fast immer die wirkliche Ursache, und die Anmeldung über einen anderen Dienst ist der Grund — ein neues Telefon bietet den bequemsten Anbieter an, und den falschen zu drücken setzt Sie in ein zweites, leeres, aber vollkommen echtes Konto.",
        pitfall:
          "Zu schließen, die Buchung sei weg, und erneut zu kaufen. Das Ticket liegt im anderen Konto, und der zweite Kauf ist ein echter Kauf.",
        takes: "5 Minuten",
      },
      {
        title: "Nutzen Sie den Browser, den die Buchungsseite erwartet, und nur offizielle Kanäle",
        body: "NOL World gibt an, nach Webstandards gebaut zu sein, und empfiehlt Google Chrome oder Microsoft Edge, auf dem Rechner wie auf dem Telefon. Öffnet sich das Buchungsfenster nicht, ist die Anweisung konkret: den Browser auf die neueste Version bringen, den Cache leeren, erneut versuchen. Für die App aktualisieren Sie aus dem App Store oder von Google Play. Und es gibt an, wo Tickets überhaupt gekauft werden können — auf der Seite von NOL World unter world.nol.com/ticket und in der App von NOL World, und sonst nirgends.",
        pitfall:
          "In einem Browser nach dem Problem zu suchen, der nie unterstützt wurde, nämlich in der Webansicht einer App, geöffnet aus einem Link in sozialen Medien. Öffnen Sie die Buchungsseite direkt in Chrome oder Edge, bevor Sie schließen, die Seite sei defekt.",
        takes: "15 Minuten, am Vortag",
      },
      {
        title: "Funktioniert der Sitzplan im mobilen Web nicht, wechseln Sie in die App",
        body: "Es gibt ein dokumentiertes Geräteproblem, kein allgemeines. NOL World gibt an, dass auf manchen Geräten die mobile Webumgebung den Browser vergrößert, wenn Sie hinein- und herauszoomen, was die Platzwahl unmöglich macht — und dass der Ausweg darin besteht, die App von NOL World zu laden. Es nennt das bislang bestätigte Gerät: Galaxy Fold. Nutzen Sie ein faltbares oder ungewöhnlich proportioniertes Display, installieren Sie die App vor dem Verkauf, statt das in einem Zahlungsfenster von sieben Minuten zu entdecken.",
        pitfall:
          "Den Sitzplan mit zwei Fingern zu vergrößern, um einen bestimmten Platz zu suchen. Auf den betroffenen Geräten ist genau diese Geste das, was die Auswahl zerstört.",
        takes: "10 Minuten, im Voraus",
      },
      {
        title: "Wissen Sie, welche Hinweisfenster kein Defekt sind",
        body: "Zwei Meldungen lesen sich wie ein Fehler und sind keiner. NOL World gibt an, dass ein Hinweisfenster mit der Mitteilung, dieser Platz sei bereits ausgewählt, erscheint, wenn Sie denselben Platz nahezu gleichzeitig mit einer anderen Person wählen — mit Ihrer Sitzung ist nichts falsch, jemand war nur eine Sekunde schneller. Und es gibt an, dass verfügbare Plätze sich automatisch ohne Neuladen aktualisieren, ein Sitzplan, der eingefroren aussieht, ist also meist ein arbeitender Sitzplan. Behandeln Sie beides als Information statt als etwas zum Reparieren.",
        pitfall:
          "Die Seite neu zu laden, um ein Hinweisfenster loszuwerden. Bei einem Verkauf mit Warteschlange ist das die eine Handlung, die Ihre Position frisst.",
        takes: "—",
      },
      {
        title: "Lesen Sie den Rat zu mehreren Tabs zusammen mit der Anti-Betrugs-Richtlinie",
        body: "NOL World bittet um ein Gerät je Konto und gibt an, dass gleichzeitiger Zugriff von mehreren Geräten auf dasselbe Konto Ihre Buchungen einschränken kann. Dann gibt es technischen Rat für Menschen, die gleichzeitig buchen — dass mehrere Tabs Sitzungskonflikte erzeugen, und dass man vollständig getrennte Browser wie Chrome und Edge oder verschiedene Geräte nutzen solle. Lesen Sie das sorgfältig, denn die eigene Anti-Betrugs-Richtlinie führt kontenübergreifende Buchungen mit identischen oder ähnlichen persönlichen Angaben als missbräuchliche Nutzung auf. Die sichere Lesart des Rats betrifft getrennte Plattformen: NOL World in einem Browser, während eine andere Ticketseite in einem anderen läuft. Es ist keine Erlaubnis, mehrere eigene Konten gleichzeitig zu betreiben.",
        pitfall:
          "Den Tipp zu Sitzungskonflikten als gebilligte Strategie für mehrere Konten zu nehmen. Die beiden Seiten stehen unbequem nebeneinander, und die mit der schriftlichen Sanktion ist die Anti-Betrugs-Richtlinie.",
        takes: "5 Minuten",
      },
      {
        title: "Löschen Sie das Konto, wissen Sie genau, was verschwindet und was bleibt",
        body: "Die Löschung ist unumkehrbar und NOL World listet sie auf. Gelöscht werden: Ihre Konto- und Profilinformationen, Ihr Buchungsverlauf, Ihre Reisen und Ihre Liste gemerkter Orte. Erhalten bleiben: Bewertungen und Fotos, die Sie zu einem Ort hinterlassen haben. Auf der Website kann jede Anmeldeart das Konto löschen. In der App führt der Weg bei Anmeldung per E-Mail über My Account, Settings, Delete Account und dann Ihr Passwort; bei Anmeldung über einen anderen Dienst ist der Weg derselbe, aber Sie bestätigen über Google, Line oder Apple. Zwei Dinge aus anderen Teilen der Dokumentation gehören daneben: Die Löschung entfernt auch Ihre Identitätsprüfung und gibt sie für ein anderes Konto frei, und ein wegen Missbrauchs eingeschränktes Konto lässt sich überhaupt nicht löschen.",
        pitfall:
          "Ein Konto zu löschen, um ein Problem mit diesem Konto zu beheben. Ein eingeschränktes Konto lässt sich nicht löschen, und ein verifiziertes nimmt Ihre Verifizierung mit — der Buchungsverlauf ist weg und die Bewertungen sind es nicht.",
        takes: "—",
      },
    ],
    faq: [
      {
        q: "Ich habe mein Passwort vergessen. Wie setze ich es zurück?",
        a: "Nur wenn Sie sich mit einer E-Mail-Adresse registriert haben — NOL World gibt an, dass die Wiederherstellung des Passworts nur für die Registrierung per E-Mail zur Verfügung steht. Der Weg führt über den Anmeldebildschirm, Find Password, die Eingabe der Registrierungsadresse und dann den Link zum Zurücksetzen, der ankommt. Nutzen Sie Google, Apple oder Line, gibt es kein Passwort bei NOL World; Sie melden sich über den Anbieter an.",
      },
      {
        q: "Ich weiß nicht einmal, welches Konto ich benutzt habe.",
        a: "Prüfen Sie zuerst beim Anbieter. NOL World veröffentlicht die Wege: Google-Konto, dann Sicherheit, dann Ihre Verbindungen zu Apps und Diensten von Drittanbietern; Settings bei Apple, dann Ihre Apple-ID, dann Sign-In & Security, dann Sign in with Apple; Settings bei Line, dann Konto, dann die zugelassenen Apps. Taucht NOL World auf, ist das das Konto.",
      },
      {
        q: "Nichts davon hat funktioniert. Wird der Kundendienst es finden?",
        a: "Er sucht, mit dem, was Sie liefern: die möglicherweise verwendete E-Mail-Adresse, die Art der Anmeldung, Ihren Anzeigenamen sowie die Art des gebuchten Produkts samt Buchungsnummer — die laut NOL World in dem Gutschein steht, der Ihnen bei der Buchung per E-Mail geschickt wurde. Es warnt außerdem, dass ein nie per E-Mail bestätigtes Konto schwer auffindbar sein kann, senden Sie also alles, was Sie haben.",
      },
      {
        q: "Ich habe das Telefon gewechselt und meine Buchungen sind weg.",
        a: "Fast sicher nicht. NOL World gibt an, dass ein Telefonwechsel oder eine erneute Anmeldung den Verlauf nicht löscht, und bittet Sie zu prüfen, ob Sie mit einem anderen Konto angemeldet sind als ursprünglich. Bei der Anmeldung über einen anderen Dienst passiert das leicht unabsichtlich — ein neues Telefon bietet den bequemsten Anbieter an, nicht unbedingt den von Ihnen genutzten.",
      },
      {
        q: "Das Buchungsfenster öffnet sich gar nicht.",
        a: "Die eigenen Schritte von NOL World: einen Standardbrowser nutzen, und es nennt Chrome und Edge; auf die neueste Version aktualisieren; den Cache leeren; erneut versuchen. Für die App auf die neueste Version aus dem App Store oder von Google Play aktualisieren. Es gibt außerdem an, dass Tickets nur unter world.nol.com/ticket oder in der App von NOL World gekauft werden können.",
      },
      {
        q: "Ich kann im Browser meines Telefons keinen Platz auswählen.",
        a: "Es gibt ein bekanntes Geräteproblem. NOL World gibt an, dass auf manchen Geräten das Hinein- und Herauszoomen den gesamten mobilen Browser vergrößert, was die Platzwahl unmöglich macht, und dass die Antwort darin besteht, die App von NOL World zu nutzen. Das von ihm als bestätigt genannte Gerät ist das Galaxy Fold. Installieren Sie die App vor dem Verkauf statt währenddessen.",
      },
      {
        q: "Kann ich zwei Tabs öffnen, um meine Chancen zu verbessern?",
        a: "Nein, und NOL World bittet um ein Gerät je Konto — es gibt an, dass gleichzeitiger Zugriff von mehreren Geräten auf dasselbe Konto Ihre Buchungen einschränken kann. Sein Rat zu getrennten Browsern betrifft Sitzungskonflikte, wenn Sie tatsächlich zwei verschiedene Ticketplattformen nutzen, und ist keine Billigung dafür, mehrere eigene Konten zu betreiben. Kontenübergreifende Buchungen mit ähnlichen persönlichen Angaben stehen auf der von ihm veröffentlichten Liste missbräuchlicher Nutzung.",
      },
      {
        q: "Was passiert mit meinen Daten, wenn ich das Konto lösche?",
        a: "NOL World gibt an, die Löschung sei unumkehrbar, und listet auf, was verschwindet: Konto- und Profilinformationen, Buchungsverlauf, Reisen und gemerkte Orte. Bewertungen und Fotos, die Sie zu einem Ort hinterlassen haben, bleiben erhalten. An anderer Stelle gibt es an, dass die Löschung auch Ihre Identitätsprüfung entfernt und sie für ein anderes Konto freigibt, und dass ein wegen Missbrauchs eingeschränktes Konto nicht gelöscht werden kann.",
      },
    ],
    labels: DE_LABELS,
  },
  {
    locale: "es",
    slug: "foreign-card-declined-korean-ticketing",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Por qué te rechazaron la tarjeta en una web de entradas coreana",
    summary:
      "Tres sistemas distintos pueden rechazar el mismo pago — la plataforma, la red de tu tarjeta y tu banco. Cada uno tiene una solución distinta y solo una de ellas es rápida.",
    scope:
      "Cubre los pagos con tarjetas emitidas fuera de Corea en plataformas coreanas de venta de entradas. No es asesoramiento financiero y no puede cubrir las normas concretas de tu banco.",
    intro: [
      "Una tarjeta rechazada en el paso del pago es el fallo más caro de toda la venta de entradas de K-pop, porque un asiento reservado vuelve al montón en cuestión de minutos. Casi todo es evitable si te lo montas con tiempo.",
      "Parece aleatorio porque tres sistemas independientes pueden rechazar la misma transacción, y el mensaje de error que ves rara vez te dice cuál de ellos lo hizo. Repásalos en el orden del tiempo que tarda cada arreglo.",
    ],
    steps: [
      {
        title: "Comprueba si la verificación de tu cuenta está realmente completa",
        body: "En varias plataformas, las tarjetas emitidas fuera de Corea solo funcionan una vez que la cuenta está verificada como cliente del extranjero. Si esa verificación sigue pendiente, la tarjeta fallará por muy sana que esté. Este es el arreglo más lento, y por eso va primero.",
        pitfall:
          "El error del pago no te va a decir «tu verificación está pendiente». Va a parecer un problema de la tarjeta.",
        takes: "1-3 días",
      },
      {
        title: "Avisa a tu banco antes de la venta, no después",
        body: "Activa las transacciones internacionales y en línea, y si tu banco lo permite, autoriza por adelantado el rango de importe y el país. Un primer cargo de un comercio coreano a una hora rara es exactamente el perfil que bloquea un sistema antifraude.",
        pitfall:
          "Los bloqueos antifraude automáticos suelen ser silenciosos de tu lado: ni SMS ni aviso en la aplicación. Solo te enteras por el rechazo genérico del comercio.",
        takes: "1 día",
      },
      {
        title: "No des el paso del pago dentro del navegador de una aplicación",
        body: "Las verificaciones de 3-D Secure y las claves de un solo uso de los bancos fallan a menudo dentro del navegador incrustado en una aplicación social o de mensajería. Usa un navegador normal, de móvil o de escritorio, y asegúrate de poder recibir el mensaje de verificación de tu banco en ese mismo dispositivo.",
        pitfall:
          "La redirección puede parecer que sale bien y luego perder la autorización sin avisar, lo que se lee como un rechazo.",
        takes: "0 minutos, solo hazlo bien",
      },
      {
        title: "Ten un respaldo de verdad, no una tarjeta hermana",
        body: "Una segunda tarjeta del mismo emisor suele fallar por el mismo motivo. Un emisor distinto, una red distinta, o el método alternativo que ofrezca la plataforma, sí es un respaldo de verdad. Las dos plataformas para el extranjero rechazan además cosas opuestas, y conviene saberlo antes de culpar a la tarjeta: NOL World acepta VISA, MasterCard, AMEX, JCB y UnionPay pero solo emitidas fuera de Corea, y rechaza de plano las tarjetas emitidas en Corea. YES24 Global hace lo contrario con dos de ellas, excluyendo American Express emitida fuera de Corea y UnionPay por completo. Una tarjeta rechazada en una puede ser la tarjeta correcta en la otra.",
        pitfall:
          "Dos tarjetas del mismo banco son una sola tarjeta a efectos de una regla antifraude.",
        takes: "30 minutos para prepararlo",
      },
      {
        title: "Comprueba la moneda y el importe antes de confirmar",
        body: "Mira si te cobran en KRW o en un importe convertido, y ten clara la comisión por transacción en el extranjero de tu tarjeta. Una conversión que empuje el total por encima de un límite que tú mismo pusiste también puede provocar un rechazo.",
        pitfall:
          "La conversión dinámica de divisa añade coste sin hacer ruido. Pagar en KRW suele ser la opción más barata.",
        takes: "5 minutos",
      },
    ],
    faq: [
      {
        q: "¿Por qué me rechazaron la tarjeta si tiene saldo?",
        a: "Casi siempre por una de tres cosas: tu cuenta en la plataforma no ha terminado la verificación de cliente del extranjero, el sistema antifraude de tu banco bloqueó un comercio extranjero desconocido, o falló un paso de 3-D Secure, normalmente porque se ejecutó dentro del navegador de una aplicación. El mensaje de rechazo casi nunca distingue entre ellas.",
      },
      {
        q: "¿Funciona PayPal?",
        a: "Algunas plataformas para el extranjero admiten métodos de pago alternativos en algunos espectáculos. Se decide por plataforma y por evento, no de forma general, así que mira las opciones de pago que aparecen en la página de tu evento antes de planificar nada alrededor.",
      },
      {
        q: "¿Pago en KRW o en mi propia moneda?",
        a: "Pagar en la moneda del comercio suele salir más barato que dejar que la página de pago convierta por ti, porque la conversión dinámica de divisa añade un margen. La comisión por transacción en el extranjero de tu propia tarjeta se aplica igual en los dos casos.",
      },
    ],
    labels: ES_LABELS,
  },
  {
    locale: "es",
    slug: "buy-k-pop-albums-from-overseas",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Cómo comprar álbumes de K-pop desde el extranjero para que cuenten",
    summary:
      "Dónde compras decide si tu compra se contabiliza, cuánto pagas de envío y si te llegan los extras del pedido anticipado. Aquí tienes cómo elegir.",
    scope:
      "Cubre la compra de álbumes físicos y artículos oficiales con entrega fuera de Corea. No cubre mercados de reventa ni productos no oficiales.",
    intro: [
      "Esta es la pregunta que sigue viva todo el año, a diferencia de las entradas — y por eso va junto a ellas. Y a diferencia de las entradas, tiene una respuesta equivocada que no te cuesta nada visible: tu álbum llega, simplemente no se contabilizó.",
      "Tres cosas cambian según dónde compres: si la venta se reporta a las listas coreanas, si vienen con ella los extras del pedido anticipado, y el coste real puesto en casa una vez metidos el envío y la aduana. No se mueven juntas, así que la opción más barata es a menudo la que no cuenta para nada.",
    ],
    steps: [
      {
        title: "Decide qué quieres realmente de la compra",
        body: "Aportar a las listas, el álbum físico, los extras del pedido anticipado, o el precio más bajo. Estas cosas tiran en direcciones distintas. Elige la prioridad antes de elegir la tienda, porque la tienda viene después de eso.",
        pitfall:
          "Comprar en un mercado generalista para ahorrar y descubrir luego que no contó es la versión estándar de este error.",
        takes: "5 minutos",
      },
      {
        title: "Comprueba si el vendedor reporta a las listas coreanas",
        body: "Las ventas que se reportan a las listas coreanas de álbumes salen de tiendas concretas y de las tiendas oficiales. Que un anuncio sea de un álbum oficial no significa que la venta se reportara. Si aportar a las listas es por lo que compras, verifica que la tienda sea de las que reportan antes de pedir.",
        pitfall:
          "Los anuncios de álbumes auténticos en mercados de terceros normalmente no cuentan. El álbum es real; la aportación no está ahí.",
        takes: "15 minutos",
      },
      {
        title: "Pide dentro de la ventana de pedido anticipado si quieres los extras",
        body: "Los beneficios del pedido anticipado — pósteres, photocards adicionales, entradas a eventos — están ligados a pedir dentro de una ventana, y a menudo a esa tienda concreta. La ventana cierra antes del día de lanzamiento, no ese día.",
        pitfall:
          "Los extras exclusivos de una tienda no son intercambiables. Pedir el mismo álbum en otro sitio te da un conjunto distinto o ninguno.",
        takes: "10 minutos",
      },
      {
        title: "Calcula el envío y la exposición a la aduana, no el álbum",
        body: "El envío desde Corea puede superar el precio del álbum, y que pagues cargos de importación encima depende de las normas de tu propio país. Mira cuáles son ahora en lugar de suponerlo: Estados Unidos suspendió su umbral de 800 dólares en agosto de 2025 y la Unión Europea eliminó el suyo de 150 euros el 1 de julio de 2026, así que para quien lea desde cualquiera de los dos ya no hay un valor lo bastante pequeño como para llegar libre. Los pedidos en grupo reducen el envío por artículo. Calcula el coste puesto en casa antes de comprometerte.",
        pitfall:
          "Planificar alrededor de una franquicia aduanera que donde vives ya no existe. Donde todavía existe una, juntar varios álbumes en un solo paquete puede empujar el valor declarado por encima de ella y costar más que enviarlos por separado — haz las dos cuentas.",
        takes: "20 minutos",
      },
      {
        title: "Guarda el registro del pedido hasta que llegue",
        body: "Guarda la confirmación, el número de seguimiento y el valor declarado. Para cualquier cosa que salga mal — un paquete dañado, una consulta de aduanas, un extra que falta — eso es lo que la tienda te va a pedir.",
        pitfall:
          "La atención al cliente de las tiendas coreanas suele trabajar con números de pedido y no con búsquedas por correo. Sin el número, la conversación va lenta.",
        takes: "5 minutos",
      },
    ],
    faq: [
      {
        q: "¿Los álbumes comprados fuera de Corea cuentan para las listas coreanas?",
        a: "Cuentan las ventas reportadas por las tiendas participantes, y eso depende de la tienda y no de dónde estés. Comprar un álbum auténtico en una tienda que no reporta significa que el álbum es real pero la venta no se contabiliza. Comprueba la tienda antes de pedir si lo que buscas es aportar a las listas.",
      },
      {
        q: "¿Merece la pena un pedido en grupo?",
        a: "Para el envío normalmente sí, porque el coste por artículo baja mucho. Compénsalo con las normas de importación de tu país — donde todavía existe una franquicia aduanera, un solo paquete de valor alto puede atraer cargos que varios paquetes pequeños no atraerían. En Estados Unidos y en la Unión Europea esa cuenta ha cambiado: los dos eliminaron sus exenciones de bajo valor, así que ya no queda umbral bajo el que quedarse.",
      },
      {
        q: "¿Por qué los beneficios del pedido anticipado son distintos entre tiendas?",
        a: "Las tiendas negocian sus propios extras exclusivos, así que el mismo álbum lleva extras distintos según dónde se haya pedido por anticipado. Si lo que quieres es un extra concreto, tienes que pedir en la tienda que lo ofrece, dentro de su ventana.",
      },
    ],
    labels: ES_LABELS,
  },
  {
    locale: "es",
    slug: "weverse-membership-renewal-overseas",
    sourceChecked: "2026-10-20",
    translated: "2026-10-21",
    review: "machine-assisted",
    title: "Renovar la membresía de Weverse desde el extranjero",
    summary:
      "El pago automático se ejecuta el último día de tu periodo a la hora en que pagaste la primera vez, en una moneda que tiene que coincidir, y si falla pasada la ventana de renovación no hay vuelta atrás salvo volver a comprarla.",
    scope:
      "Cubre mantener en marcha una Official Membership de Weverse que ya tienes, y lo que cuesta que se corte. Entrar por primera vez en un club de fans, y calificar para una preventa concreta, son cuestiones aparte que están en la guía de preventa. Todo lo de aquí sale del aviso de Weverse Shop del 3 de septiembre de 2026 y de las páginas de producto a las que remite.",
    intro: [
      "Una membresía que se corta en la semana equivocada no te cuesta una suscripción. Te cuesta la preventa, porque la elegibilidad se comprueba contra una membresía que estuviera activa antes de una fecha límite, y comprarla otra vez después no mueve esa fecha.",
      "Weverse añadió el pago automático el 3 de septiembre de 2026, lo que elimina la forma habitual de que se corte. También introdujo cuatro reglas fáciles de equivocar, y un punto sin retorno.",
    ],
    steps: [
      {
        title: "Averigua en qué categoría de membresía estás",
        body: "Weverse gestiona las membresías en tres categorías — Global, Japan y USA — y se administran por separado. Los métodos de pago, las monedas y los ajustes del pago automático son por categoría, y se pueden guardar hasta cinco métodos de pago en cada una, con uno marcado como principal. En qué categoría estás no es algo que elijas a la ligera; es donde ya vive tu membresía.",
        pitfall:
          "Configurar el pago automático en la categoría que no usas. La pantalla se ve idéntica y la membresía que se renueva es la otra.",
        takes: "5 minutos",
      },
      {
        title: "Comprueba que tu moneda es una que la categoría acepta de verdad",
        body: "A 3 de septiembre de 2026: una Global Membership admite tarjetas de débito o crédito surcoreanas para KRW, y tarjetas registradas en PayPal para JPY, USD o MXN. Una Japan Membership admite tarjetas de crédito para JPY. Una US Membership admite tarjetas registradas en PayPal para USD. Para un fan en el extranjero con una Global Membership pagando en USD, eso significa que la tarjeta pasa por PayPal — no hay opción de tarjeta directa.",
        pitfall:
          "Esperar registrar una Visa directamente en una Global Membership en USD. El mismo patrón recorre Weverse Shop, y es la razón de que una tarjeta que funciona en todas partes pueda fallar aquí.",
        takes: "10 minutos",
      },
      {
        title: "Haz que la moneda de compra coincida con la del método principal",
        body: "Weverse lo dice directamente: la moneda de pago con la que compraste la membresía tiene que coincidir con la moneda de pago de tu método principal de pago automático. Un desajuste no se resuelve a tu favor en el momento de la renovación — es una renovación que no sale.",
        pitfall:
          "Comprar una membresía en una moneda y añadir después un método principal en otra, lo que se ve bien en las dos pantallas y solo falla el día que importa.",
        takes: "3 minutos",
      },
      {
        title: "Ten claro el momento exacto en que se renueva",
        body: "El pago automático se ejecuta el último día del periodo de validez de la membresía actual, a la misma hora del día en que pagaste la primera vez. Esa hora se fijó en un servidor coreano, así que para casi todo el que lea esto cae en algún punto de la noche o la madrugada. Si falla, Weverse envía un correo y una notificación push y reintenta una vez al día a la misma hora, mientras dure el periodo de renovación.",
        pitfall:
          "Una tarjeta que caduca a mitad del periodo, o un banco que bloquea el cargo, se convierte en una notificación que llega a las cuatro de la madrugada en tu hora. El reintento es diario, no cada hora: un día sin ver el correo es un día de ventana gastado.",
        takes: "2 minutos",
      },
      {
        title: "Entiende lo que cancelar el pago automático no hace",
        body: "Cancelar el pago automático detiene las renovaciones futuras. No cancela ni reembolsa la membresía que ya tienes, y sigues usándola con normalidad hasta que termine el periodo de validez. La cancelación y el reembolso de la membresía en sí son un asunto aparte que rige la página de producto de esa membresía.",
        pitfall:
          "Cancelar el pago automático esperando que te devuelvan dinero, y además: cancelarlo para «pausar» mientras se rumorea una gira, que es justo la semana en la que menos quieres que la renovación se detenga.",
        takes: "2 minutos",
      },
      {
        title: "Trata el final del periodo de renovación como un punto sin retorno",
        body: "Si cancelaste el pago automático puedes reactivarlo — pero solo mientras el periodo de renovación siga en marcha. Una vez terminado ese periodo, la reactivación no está disponible y el único camino es comprar la membresía otra vez. Weverse da además dos controles manuales dentro de la ventana: Pay Now para renovar de inmediato, y Retry Now si un pago falló con un método que ya has arreglado.",
        pitfall:
          "Esperar a ver si los reintentos salen bien. Retry Now y Pay Now existen precisamente para que no tengas que hacerlo, y los dos desaparecen cuando la ventana cierra.",
        takes: "5 minutos",
      },
      {
        title: "Renueva en lugar de volver a comprar, porque el registro se arrastra",
        body: "Cuando una membresía se renueva mediante el pago automático, los datos de miembro registrados en la membresía existente se conservan en la siguiente. Ese registro — el nombre que lleva, en particular — es contra lo que se ejecuta una comprobación de elegibilidad para una preventa. Comprar una membresía nueva después de un corte empieza un registro nuevo y una fecha de inicio nueva, y esa es la parte que cuesta una preventa y no una cuota.",
        pitfall:
          "Suponer que la continuidad va de lealtad. Va de una fecha y un nombre en un registro, y un hueco en cualquiera de los dos es lo que ve la comprobación.",
        takes: "2 minutos",
      },
    ],
    faq: [
      {
        q: "¿Puedo pagar una Global Membership con mi propia Visa o Mastercard?",
        a: "No directamente, fuera de KRW. Una Global Membership admite tarjetas coreanas para KRW, y tarjetas registradas en PayPal para JPY, USD o MXN — así que tu tarjeta llega a Weverse a través de PayPal y no como un pago directo con tarjeta.",
      },
      {
        q: "¿Cuándo me cobra exactamente el pago automático?",
        a: "El último día del periodo de validez de tu membresía actual, a la misma hora del día en que pagaste la primera vez. Esa hora se fijó en un reloj coreano, así que conviértela a la tuya.",
      },
      {
        q: "Si el pago automático falla, ¿cuántas oportunidades tengo?",
        a: "Weverse te avisa por correo y notificación push, y luego reintenta una vez al día a la misma hora durante lo que quede del periodo de renovación. También puedes usar Retry Now después de arreglar el método de pago, o Pay Now para renovar de inmediato.",
      },
      {
        q: "Cancelé el pago automático. ¿Puedo volver a activarlo?",
        a: "Sí, mientras el periodo de renovación siga abierto — hay un control de reactivación justo para eso. Después de que termine el periodo de renovación no puedes, y la única opción es comprar la membresía otra vez.",
      },
      {
        q: "¿Importa que mi membresía se corte unos días?",
        a: "Puede importar más que el precio. La renovación conserva los datos de miembro de la membresía existente; una recompra empieza un registro nuevo con una fecha nueva. La elegibilidad para una preventa se comprueba contra ese registro y su fecha límite, no contra cuánto tiempo llevas siendo fan.",
      },
    ],
    labels: ES_LABELS,
  },
];

/** Every locale that actually has at least one translated guide. */
export function localesWithContent(): Locale[] {
  return [...new Set(translations.map((t) => t.locale))];
}

export function getTranslation(slug: string, locale: Locale): Translation | undefined {
  return translations.find((t) => t.slug === slug && t.locale === locale);
}

/** The locales a given guide has been translated into. */
/**
 * Other guides a reader of this language can actually read.
 *
 * The translated template carried no related rail at all, and the reason was
 * sound while a language had one or two pages: a rail would have been a list
 * of links into English, and a translated page that funnels into English is
 * worse than one that stops honestly. At six pages per language that reason
 * inverts. Six pages with no links between them are six dead ends, and the
 * only way Google finds the sixth is the sitemap — on a site whose single
 * channel is search, that is the difference between a translated section and
 * six orphans.
 *
 * The relationships are not computed from tags or platform overlap. They are
 * the `see` cross-references already authored into the English guide's steps,
 * because somebody decided those were the guides worth sending a reader to and
 * a similarity score did not. Anything with no translation in this locale is
 * dropped rather than linked in English, which is the original rule doing its
 * job rather than being abandoned.
 *
 * They run **both ways**, outbound first in the order the steps mention them,
 * then the guides that point back. A `see` is a statement that two guides
 * belong together, and that is symmetric even though the field is not: read
 * one-way, the albums guide had no rail at all despite three guides pointing
 * at it, and the queue guide was an orphan in both directions because its one
 * reference goes to the timezone guide, which is deliberately untranslated.
 * The queue guide is also why the English gained a reference *to* it from the
 * sale-day step of guide 01 — a page nothing links to is a gap in the English,
 * not something for the rail to paper over.
 */
export function relatedTranslations(
  slug: string,
  locale: Locale,
): { slug: string; title: string }[] {
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) return [];
  const seen = new Set<string>([slug]);
  const out: { slug: string; title: string }[] = [];
  const add = (target: string) => {
    if (seen.has(target)) return;
    seen.add(target);
    const tr = getTranslation(target, locale);
    if (tr) out.push({ slug: target, title: tr.title });
  };
  for (const step of guide.steps) if (step.see) add(step.see.slug);
  for (const other of guides) {
    if (other.slug === slug) continue;
    if (other.steps.some((s) => s.see?.slug === slug)) add(other.slug);
  }
  return out;
}

export function translationsFor(slug: string): Translation[] {
  return translations.filter((t) => t.slug === slug);
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const REVIEWS: ReviewLevel[] = ["machine-assisted", "native-reviewed"];
const today = new Date().toISOString().slice(0, 10);

for (const t of translations) {
  const guide = guides.find((g) => g.slug === t.slug);
  if (!guide) {
    throw new Error(
      `translation (${t.locale}) names an unknown guide: ${t.slug}`,
    );
  }
  if (!LOCALES[t.locale]) {
    throw new Error(`translation of ${t.slug} uses an unknown locale: ${t.locale}`);
  }
  if (t.locale === "en") {
    throw new Error(
      `${t.slug} has a translation declared for "en" — English is the source, ` +
        `not a translation of itself.`,
    );
  }
  for (const [field, value] of [
    ["sourceChecked", t.sourceChecked],
    ["translated", t.translated],
  ] as const) {
    if (!DATE.test(value)) {
      throw new Error(`${t.slug} (${t.locale}): ${field} is not YYYY-MM-DD: ${value}`);
    }
  }
  // A future sourceChecked would never equal the guide's lastChecked and so
  // would never go "behind" either — it would sit at "current" forever.
  if (t.sourceChecked > today) {
    throw new Error(
      `${t.slug} (${t.locale}): sourceChecked ${t.sourceChecked} is in the future.`,
    );
  }
  if (t.translated < t.sourceChecked) {
    throw new Error(
      `${t.slug} (${t.locale}): translated ${t.translated} is before the source ` +
        `check it claims to be based on (${t.sourceChecked}).`,
    );
  }
  if (!REVIEWS.includes(t.review)) {
    throw new Error(
      `${t.slug} (${t.locale}): review must be one of ${REVIEWS.join(", ")}`,
    );
  }
  // A translation that drops steps is not a translation of the page a reader
  // was linked to, and the missing step is always the one that mattered.
  //
  // The same goes for the FAQ, and that one was found the hard way: the
  // freshness rules key on `lastChecked`, which records when a source was last
  // held against the live platform — not when the English text was edited. So
  // adding an answer to a guide without re-checking anything leaves every
  // translation of it one answer short while still reporting `current`. The
  // count is the cheap half of catching that; the expensive half is still
  // remembering to translate the new answer.
  for (const [name, mine, theirs] of [
    ["steps", t.steps.length, guide.steps.length],
    ["faq entries", t.faq.length, guide.faq.length],
  ]) {
    if (mine !== theirs) {
      throw new Error(
        `${t.slug} (${t.locale}): has ${mine} ${name} but the English guide ` +
          `has ${theirs}. A translation may not drop or add them — if the ` +
          `English gained content, translate it or the page is silently short.`,
      );
    }
  }
}
