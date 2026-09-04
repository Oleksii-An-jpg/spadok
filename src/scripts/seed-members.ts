import {admin} from "@/lib/admin";
import {MembersConverter} from "@/api/members";
import {Member} from "@/models/member";

const MEMBERS: Omit<Member, 'id' | 'order'>[] = [
    {
        photo: "/photos/Божнюк Аліна.png",
        name: "Аліна Божнюк",
        role: "Ініціаторка та кураторка",
        description: "Співзасновниця проєкту. Креативна лідерка. Поціновувачка старовини. Обожнює спільноти й спільнотворчість. Виховує песа Каремата, кота Мишу та папугу Кешу. Мріє про будиночок у Квасах.",
        instagram: "https://www.instagram.com/bozhnyuk/",
    },
    {
        photo: "/photos/hanna.png",
        name: "Аня Кащеєва",
        role: "Креативна директорка",
        description: "Співзасновниця проєкту. Креаторка, лекторка з копірайтингу, призерка фестивалю креативності Cannes Lions, шанувальниця гарних ідей і добрих людей.",
        instagram: "https://instagram.com/litttlepony",
    },
    {
        photo: "/photos/oleksii.png",
        name: "Олексій Ан",
        role: "Технічний директор",
        description: "Співзасновник проєкту. Військовослужбовець ЗСУ. Айтівець з часів, коли ніхто не знав, що таке айті, Front End викладач, дослідник кулінарії, велосипедист, сноубордист та гірський ентузіаст.",
        instagram: "https://instagram.com/oleksii.an",
    },
    {
        photo: "/photos/hanna_iatel.png",
        name: "Ганна Ятель",
        role: "Кураторка з маркетингу",
        description: "Маркетологиня цифрових продуктів. Поціновувачка усього аналогового: рослин, культурної спадщини, людей.",
        instagram: "https://www.instagram.com/a_yatel",
    },
    {
        photo: "/photos/iuliia.png",
        name: "Юлія Люлько",
        role: "Кураторка контенту",
        description: "Екс-музейниця, поціновувачка книг з естетичними ілюстраціями і цікавинок з вінтажних риночків. Виховує богемного кота Матісса, любить грати у «Що? Де? Коли?» і створювати ялинкові прикраси.",
        instagram: "https://www.instagram.com/lavi_yuliia/",
    },
    {
        photo: "/photos/Саєнко Іванна.png",
        name: "Іванна Саєнко",
        role: "Проєктна менеджерка",
        description: "Надихається живою культурою та спільнотами, що творять зміни. Любить купувати гарні книжки, фотографувати на плівку, танцювати, ходити в театр і творчість у різних її формах.",
        instagram: "https://www.instagram.com/s.ivka/",
    },
    {
        photo: "/photos/Олена Стасюк.png",
        name: "Олена Стасюк",
        role: "Проєктна менеджерка",
        description: "У минувшині — архітекторка, нині — етно-майстриня й дослідниця прекрасних речей. Обожнює знаходити красу в деталях і показувати її всім охочим. Збирає подільські рушники, а також час від часу займається традиційним співом.",
        instagram: "https://www.instagram.com/o_garnaya/",
    },
    {
        photo: "/photos/iryna_maiko.png",
        name: "Ірина Майко",
        role: "Проєктна менеджерка",
        description: "Жартівниця, дослідниця, організаторка цікавих штук. Любить якісну командну роботу, моменти дитячої творчості та запал в очах навпроти.",
        instagram: "https://www.instagram.com/jemappelleirein",
    },
    {
        photo: "/photos/oksana.png",
        name: "Оксана Тригуб",
        role: "Координаторка напрямку пошуку речей",
        description: "Художниця та дизайнерка. Любить малювати скетчі у кав'ярнях, особливо якщо там є великі фікуси. Колекціонує народні рушники, вишиті нерахунковими видами гладі.",
        instagram: "https://www.instagram.com/art_traditional_ua",
    },
    {
        photo: "/photos/nataliia_sukhoviy.png",
        name: "Наталія Суховій",
        role: "Менеджерка з пошуку речей",
        description: "Цінує творчість у всіх її проявах, займається туризмом, йогою, люблить подорожі і книги.",
        instagram: "https://www.instagram.com/zdorova_bucha/",
    },
    {
        photo: "/photos/Катерина Синявська.png",
        name: "Катерина Синявська",
        role: "Режисерка монтажу",
        description: "Усе й одразу: вчора режисерка монтажу, сьогодні режисерка, завтра моушен-дизайнерка, вчора чеська філологія, сьогодні бразильське джиу джитсу, а завтра театральний гурток. Ніколи не знає, куди її приведе доля і власна допитливість, але це точно буде щось цікаве. Виросла у сім’ї режисера території “А” і пишається цим фактом. Любить караоке, але цим фактом не пишається.",
        instagram: "https://www.instagram.com/kaa_sin/",
    },
    {
        photo: "/photos/Гарбузова Анастасія.png",
        name: "Анастасія Гарбузова",
        role: "Дизайнерка",
        description: "Дизайнерка-ілюстраторка, рекламниця, креаторка різних штук. Закохана у наївне та стихійне.",
        instagram: "https://www.instagram.com/harboozana/",
    },
    {
        photo: "/photos/Анастасія Кулик.png",
        name: "Настя Кулік",
        role: "Дизайнерка",
        description: "Художниця, дизайнерка. Любить тонке українське. Малює сучасну ікону і те, що приносить світло.",
        instagram: "https://www.instagram.com/bo_vse_art/",
    },
    {
        photo: "/photos/Гордієнко Богдана.png",
        name: "Богдана Гордієнко",
        role: "Дизайнерка",
        description: "Любить поєднувати українське і сучасне, як в одязі, так і в творчості, саме тому є частиною Спільного Спадку. Любить створювати прикраси, ходити на замальовки з натури і створювати вітражі фарбами, любить природу і маленькі міста, любить робити гарні світлини. Займається всім потроху.",
        instagram: "https://www.instagram.com/_dana_gordienko_/",
    },
    {
        photo: "/photos/Марія Васильєва.png",
        name: "Марія Васильєва",
        role: "Дизайнерка",
        description: "Музейниця й археологиня, яка поєднує наукову основу з доступною подачею, щоб складні теми ставали зрозумілими та цікавими. Створює контент, що робить знання простими, але змістовними. Любить подорожі, вишивку й турботу про свою 100-річну хату-мазанку, де минуле відчувається особливо близько.",
        instagram: "https://www.instagram.com/visual.mria",
    },
    {
        photo: "/photos/Оля Шевчук.png",
        name: "Ольга Шевчук",
        role: "Копірайтерка",
        description: "Копірайтерка, менеджерка культурних проєктів, креаторка. Планує встигнути все на світі до 95 років.",
        instagram: "https://www.instagram.com/olastardust/",
    },
    {
        photo: "/photos/Ткаченко Ольга.png",
        name: "Ольга Ткаченко",
        role: "Редакторка",
        description: "Випускова редакторка у видавництві за професією, культурологиня за освітою, одіссейка за способом життя. Любить читати, малювати, брати участь у подіях, пов'язаних з мистецтвом, сучасною і традиційною культурою. А ще ділитися враженнями про них з близькими за духом людьми.",
        instagram: "https://www.instagram.com/olya.oliunia",
    },
    {
        photo: '/photos/iuliia_kovalska.png',
        name: 'Юлія Ковальська',
        role: 'Адміністраторка сайту',
        description: 'Технологиня-конструкторка одягу. Захоплюється дослідженням крою традиційного одягу та технік вишивки. У магазині може зацікавитися виворотом виробу більше, ніж ним самим — бо саме там часто ховається найцікавіше. Любить речі поза часом, тишу та природу.',
        instagram: 'https://www.instagram.com/yulia_kostelna'
    },
    {
        photo: "/photos/Ольга Хархальова.png",
        name: "Ольга Хархальова",
        role: "Веб-дизайнерка",
        description: "Дослідниця візуальних мов, керамістка, старша серед трьох сестер.",
        instagram: "https://www.instagram.com/olhakharkhalova/",
    },
    {
        photo: "/photos/Катерина Ганжала.png",
        name: "Катерина Ганжала",
        role: "Event-менеджерка",
        description: "Юристка з креативною душею. Любить людей, історії, красиві речі та життя. Мріє створювати проєкти, які мають вплив і залишають післясмак.",
        instagram: "https://www.instagram.com/katyahanzhala",
    },
    {
        photo: "/photos/Галина Лінкс.png",
        name: "Галина Лінкс",
        role: "Event-менеджерка",
        description: "Режисерка, івент-менеджерка, художниця, дизайнерка, викладачка — поціновувачка мистецтва у будь-якому його прояві. Любить подорожі та цікаві знайомства. Не чекає натхнення — просто робить улюблену справу. Обожнює дітей і вірить в силу якісної освіти.",
        instagram: "https://www.instagram.com/feeling_of_height",
    },
    {
        photo: "/photos/illia.png",
        name: "Ілля Почкун",
        role: "Автор візуального стилю",
        description: "Співзасновник креативної агенції Taktika, музикант, художник, друг всіх тварин і володар дитячого розряду з айкідо.",
        instagram: "https://instagram.com/pochkun",
    }
]

/**
 * One-off import of the team that used to live hard-coded on the homepage.
 * Members already present (matched by name) are left untouched,
 * so the import is safe to run more than once.
 */
export async function seedMembers() {
    const collection = admin.collection('members').withConverter(new MembersConverter());
    const snapshot = await collection.get();
    const existing = new Set(snapshot.docs.map((doc) => doc.data().name));
    const missing = MEMBERS.filter((member) => !existing.has(member.name));

    let order = snapshot.docs.reduce((max, doc) => Math.max(max, doc.data().order ?? 0), -1);

    for (const member of missing) {
        order += 1;
        await collection.add({ ...member, order } as Member);
    }

    return { imported: missing.length, skipped: MEMBERS.length - missing.length };
}
