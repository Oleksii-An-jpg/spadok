'use server'
import Section from "@/components/section";
import Link from "next/link";

export default async function Home() {
  return (
      <main>
          <Section className="py-24 xl:py-48 text-center" variant="secondary">
              {/*<Logo*/}
              {/*    id="logo"*/}
              {/*    size="large"*/}
              {/*    variant="secondary"*/}
              {/*    className="inline-flex mb-16"*/}
              {/*/>*/}
              <p>
                  «Спільний спадок» — це перший український краудфандинг, що об’єднує
                  людей, які захоплюються українською культурою і бажають долучитися до
                  її збереження та поширення.
              </p>
              <p className="mb-8 xl:mb-16">
                  Нас тішить спалах цікавості до всього українського, тому ми створили
                  спільноту однодумців, щоб шукати старовинні українські речі у вільному
                  продажу й спільно викуповувати найцінніші з них для найулюбленіших
                  музеїв.
              </p>
              <Link
                  className="inline-block p-5"
                  href="https://www.patreon.com/spilnyi_spadok"
                  target="_blank"
              >
                  {/*<Button size="large" variant="secondary">*/}
                  {/*    Доєднатися*/}
                  {/*</Button>*/}
              </Link>
          </Section>
          <Section className="py-24 xl:py-48" variant="quaternary">
              <div className="xl:flex xl:justify-between xl:gap-x-40">
                  <div>
                      <h2 className="text-2xl xl:text-4xl mb-6 font-light leading-[30px]">
                          Які музеї ми <br /> підтримуємо?
                      </h2>
                  </div>
                  <div>
                      <p className="mb-3.5">
                          Наразі ми співпрацюємо з Національним центром народної культури
                          «Музей Івана Гончара» в Києві. Музей було створено не державою, а
                          зусиллями митця, етнографа й колекціонера Івана Гончара, який
                          прагнув зберегти культурну спадщину України всупереч заборонам
                          радянської влади. Нам дуже імпонує цей підхід, адже вважаємо, що
                          збереження національних традицій та ідентичності зазвичай
                          відбувається саме завдяки зусиллям небайдужих людей.
                      </p>
                      <p>
                          За 20 місяців нашої діяльності ми врятували й передали до Музею
                          Івана Гончара 100 предметів народного вбрання, народних картин та
                          ікон, давніх світлин та рушників з різних регіонів України.
                      </p>
                  </div>
              </div>
          </Section>
          <Section className="py-24 xl:py-48 text-center" variant="secondary">
              {/*<Avatar*/}
              {/*    src="/photos/petro.png"*/}
              {/*    alt="Петро Гончар"*/}
              {/*    decorated*/}
              {/*    size="large"*/}
              {/*    priority*/}
              {/*/>*/}
              <div className="flex flex-col">
                  <div className="w-52 xl:w-96 my-6 mx-auto xl:mt-16 xl:mb-0 text-center xl:order-last">
                      <h3 className="text-xl xl:text-4xl mb-1.5 xl:mb-3">Петро Гончар</h3>
                      <p className="text-xs xl:text-base">
                          Генеральний директор Музею Івана Гончара, художник
                      </p>
                  </div>
                  <p className="mb-3.5 xl:mt-16">
                      «Кожен музейний предмет, кожна пісня чи обряд є важливою клітинкою
                      українського всесвіту. За давніми речами стоять особисті історії та
                      долі людей, емоції, відчуття краси та світу нашими предками, наша
                      спільна історія й культура, виплекана цілими поколіннями. Ми
                      збираємо по крихті ці фрагменти мозаїки, фахово та з любов&apos;ю
                      очищаємо, досліджуємо їх та ретельно зберігаємо для майбутніх
                      поколінь.
                  </p>
                  <p className="mb-3.5">
                      Ми відкриваємо для кожного нового покоління простір традиції, яка в
                      живому побутуванні вже значною мірою втрачена. З музейних досліджень
                      постає картина українського світу, з якого ми маємо виростати і
                      формуватися сьогодні. Це наш простір для самопізнання, це вогонь
                      нашої боротьби, це спростування фейків про відсутність українців на
                      історичній мапі світу, це джерело для ревної любові до свого народу.
                  </p>
                  <p>
                      Музей Івана Гончара є рідним домом для кожного українця. Тут ви
                      знайде для себе силу і натхнення».
                  </p>
              </div>
          </Section>
          <Section className="py-24 xl:py-48" variant="quaternary">
              <div className="xl:flex xl:justify-between xl:gap-x-40">
                  <div>
                      <h2 className="text-2xl xl:text-4xl mb-6 font-light leading-[30px] whitespace-nowrap">
                          Як ми <br /> обираємо речі?
                      </h2>
                  </div>
                  <div>
                      <p className="mb-5">
                          Спочатку наша команда вивчає пропозиції онлайн (це можуть бути
                          аукціони, оголошення від продавців у соцмережах, на OLX тощо) та
                          бронюють річ, далі відбувається погодження з науковими
                          співробітниками музею щодо якості та цінності речі, потреби для
                          колекції музею та об’єктивності ціни. Після цього ми викуповуємо
                          річ.
                      </p>
                      <p>
                          На жаль, велика кількість традиційних речей, що колись були
                          родинною реліквією, останніми роками через різні причини стають
                          предметами перепродажів, нищаться або вивозяться за кордон. Так
                          втрачається можливість дослідити й зберегти традиції сотень сіл з
                          різних регіонів України. Ми не можемо повернути час назад, але
                          можемо спробувати врятувати найцікавіші предмети, викуповуючи їх
                          для зберігання й вивчення Музеєм Івана Гончара.
                      </p>
                  </div>
              </div>
          </Section>
          <Section className="py-24 xl:py-48 text-center" variant="primary">
              <h2 className="text-2xl xl:text-4xl mb-6 xl:mb-8 font-light leading-[30px]">
                  Як доєднатися?
              </h2>
              <p className="mb-3.5">
                  Щоб долучитися до проєкту, можна оформити передплату на Patreon. Усі
                  зібрані кошти ми спрямовуємо на купівлю речей та сплату податків.
                  Команда «Спільного спадку» працює безоплатно та регулярно звітує:
              </p>
              <ul className="mb-8 xl:mb-16 list-disc list-inside">
                  <li>
                      Щомісяця ми публікуємо детальний звіт про всі зібрані та витрачені
                      кошти на цьому сайті.
                  </li>
                  <li>
                      Впродовж тижня після купівлі кожної з речей ми детально звітуємо на
                      нашому Patreon: додаємо фото речі, пояснюємо її цінніть та вказуємо
                      вартість.
                  </li>
              </ul>
              <Link
                  className="inline-block p-5"
                  href="https://www.patreon.com/spilnyi_spadok"
                  target="_blank"
              >
                  {/*<Button size="large" variant="tertiary">*/}
                  {/*    Доєднатися*/}
                  {/*</Button>*/}
              </Link>
          </Section>
          <Section className="py-24 xl:py-48" variant="quaternary">
              <div className="flex flex-wrap xl:flex-nowrap gap-x-2.5 gap-y-6 xl:gap-x-40">
                  <div className="basis-2/4">
                      <h3 className="text-xl xl:text-4xl leading-6 mb-3 xl:mb-6 font-light whitespace-nowrap">
                          Зібрано <br /> коштів
                      </h3>
                      {/*{values.raised ? (*/}
                      {/*    <h2 className="text-2xl xl:text-8xl">*/}
                      {/*        {getDisplayPrice(values.raised)}*/}
                      {/*    </h2>*/}
                      {/*) : (*/}
                      {/*    <p className="text-xs xl:text-base">*/}
                      {/*        Перші внески ми отримаємо на рахунок 05.03, на цей момент вони*/}
                      {/*        зберігаються на платформі Patreon*/}
                      {/*    </p>*/}
                      {/*)}*/}
                  </div>
                  <div className="xl:basis-2/4">
                      <h3 className="text-xl xl:text-4xl leading-6 mb-3 xl:mb-6 font-light whitespace-nowrap">
                          Витрачено <br /> коштів
                      </h3>
                      <h2 className="text-2xl xl:text-8xl">
                          {/*{getDisplayPrice(values.spent)}*/}
                      </h2>
                  </div>
              </div>
              <p className="mt-5 xl:mt-12 text-xs xl:text-base text-gray-600">
                  {/*Оновлено {values.time}*/}
                  <br />
                  <Link
                      href="https://drive.google.com/drive/folders/17Mxma3CNvxm8cnLgl2JvpLDOdtgVDurY"
                      className="underline"
                      target="_blank"
                      rel="noreferrer"
                  >
                      звіт від БФ «КОЛО»
                  </Link>
              </p>
              <h3 className="text-xl xl:text-4xl leading-10 mb-6 font-light mt-12 whitespace-nowrap">
                  Передані речі
                  <br /> до музею:
              </h3>
              <div>
                  {/*{toShow.map((exhibit, index) => {*/}
                  {/*    return <ExhibitUI key={index} {...exhibit} />;*/}
                  {/*})}*/}
                  <div className="mt-8 text-center">
                      {/*<Button*/}
                      {/*    onClick={() => {*/}
                      {/*        if (count === exhibits.length - 1) {*/}
                      {/*            setCount(limit);*/}
                      {/*            return;*/}
                      {/*        }*/}
                      {/*        setCount(count + limit);*/}
                      {/*    }}*/}
                      {/*    decorated={false}*/}
                      {/*    size="medium"*/}
                      {/*    variant="primary"*/}
                      {/*>*/}
                      {/*    {count === exhibits.length - 1 ? 'Приховати' : `Більше`}*/}
                      {/*</Button>*/}
                  </div>
              </div>
              {/*<h2 className="text-2xl xl:text-4xl mb-12 font-light leading-[30px]">*/}
              {/*  В дорозі до <br /> музею:*/}
              {/*</h2>*/}
              {/*<div>*/}
              {/*  <div className="flex justify-between gap-x-10 text-xs xl:text-base xl:gap-x-48 mt-8 first:mt-0">*/}
              {/*    <div>*/}
              {/*      <div>Вартість:</div>*/}
              {/*      <div className="text-sm xl:text-2xl">{getDisplayPrice(5000)}</div>*/}
              {/*    </div>*/}
              {/*    <div className="flex-1 text-xs xl:text-base">*/}
              {/*      <p>*/}
              {/*        Давня дитяча сорока з Тячівського району Закарпатської області*/}
              {/*      </p>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</div>*/}
          </Section>
          <Section className="py-24 xl:py-48" variant="quaternary">
              <div className="xl:flex xl:justify-between xl:gap-x-40">
                  <div>
                      <h2 className="text-2xl xl:text-4xl mb-10 font-light leading-[30px]">
                          Команда <br /> проєкту
                      </h2>
                  </div>
                  <div className="flex-1 divide-y-2 divide-black border-y-2 border-y-black">
                      {/*<TeamMember*/}
                      {/*    photo="/photos/alina.png"*/}
                      {/*    name="Аліна Божнюк"*/}
                      {/*    role="Співзасновниця та кураторка"*/}
                      {/*    description="Ініціаторка «Спільного спадку». Колекціонерка українського народного вбрання, поціновувачка старовини. Обожнює, коли люди об’єднуються та створюють щось нове і суспільно важливе. Менеджерка в креативних сферах та просто добра людина."*/}
                      {/*    instagram="https://www.instagram.com/bozhnyuk/"*/}
                      {/*/>*/}
                      {/*<TeamMember*/}
                      {/*    photo="/photos/hanna.png"*/}
                      {/*    name="Аня Кащеєва"*/}
                      {/*    role="Співзасновниця та креативна директорка"*/}
                      {/*    description="Креаторка, лекторка з копірайтингу, призерка фестивалю креативності Cannes Lions, шанувальниця гарних ідей і добрих людей."*/}
                      {/*    instagram="https://instagram.com/litttlepony"*/}
                      {/*/>*/}
                      {/*<TeamMember*/}
                      {/*    photo="/photos/oleksii.png"*/}
                      {/*    name="Олексій Ан"*/}
                      {/*    role="Технічний директор та веб-розробник"*/}
                      {/*    description="Айтівець з часів, коли ніхто не знав, що таке айті, Front End викладач, дослідник кулінарії, велосипедист, сноубордист та гірський ентузіаст."*/}
                      {/*    instagram="https://instagram.com/oleksii.an"*/}
                      {/*/>*/}
                      {/*<TeamMember*/}
                      {/*    photo="/photos/hanna_iatel.png"*/}
                      {/*    name="Ганна Ятель"*/}
                      {/*    role="Менеджерка з комунікацій"*/}
                      {/*    description="Маркетологиня цифрових продуктів. Поціновувачка усього аналогового: рослин, культурної спадщини, людей."*/}
                      {/*    instagram="https://www.instagram.com/a_yatel"*/}
                      {/*/>*/}
                      {/*<TeamMember*/}
                      {/*    photo="/photos/oksana.png"*/}
                      {/*    name="Оксана Тригуб"*/}
                      {/*    role="Менеджерка з пошуку речей"*/}
                      {/*    description="Художниця та дизайнерка. Любить малювати скетчі у кав'ярнях, особливо, якщо там є великі фікуси. Колекціонує народні рушники, вишиті нерахунковими видами гладі."*/}
                      {/*    instagram="https://www.instagram.com/art_traditional_ua"*/}
                      {/*/>*/}
                      {/*<TeamMember*/}
                      {/*    photo="/photos/iuliia.png"*/}
                      {/*    name="Юлія Люлько"*/}
                      {/*    role="Менеджерка"*/}
                      {/*    description="Музейниця, поціновувачка книг з естетичними ілюстраціями і цікавинок з вінтажних риночків. Виховує богемного кота Матісса, любить грати у «Що? Де? Коли?» і створювати ялинкові прикраси."*/}
                      {/*    instagram="https://www.instagram.com/la_vi_13"*/}
                      {/*/>*/}
                      {/*<TeamMember*/}
                      {/*    photo="/photos/illia.png"*/}
                      {/*    name="Ілля Почкун"*/}
                      {/*    role="Автор візуального стилю"*/}
                      {/*    description="Співзасновник креативної агенції Taktika, музикант, художник, друг всіх тварин і володар дитячого розряду з айкідо."*/}
                      {/*    instagram="https://instagram.com/pochkun"*/}
                      {/*/>*/}
                      {/*<TeamMember*/}
                      {/*    photo="/photos/olena.png"*/}
                      {/*    name="Олена Довгопол"*/}
                      {/*    role="Дизайнерка"*/}
                      {/*    description="Графічна дизайнерка, іллюстраторка, лекторка та видумщиця приколів."*/}
                      {/*    instagram="https://www.instagram.com/odovhopol"*/}
                      {/*/>*/}
                  </div>
              </div>
          </Section>
          <Section className="py-24 xl:py-48 text-center" variant="tertiary">
              <h2 className="max-w-4xl mx-auto text-2xl xl:text-4xl mb-8 xl:mb-16 font-light leading-[30px]">
                  Досліджувати й розвивати нашу спільну спадщину — велика любов. Разом
                  ми можемо робити маленькі справи, аби поширювати цю любов країною.
              </h2>
              <Link
                  className="inline-block p-5"
                  href="https://www.patreon.com/spilnyi_spadok"
                  target="_blank"
              >
                  {/*<Button size="large" variant="secondary">*/}
                  {/*    Доєднатися*/}
                  {/*</Button>*/}
              </Link>
          </Section>
          <Section className="py-24 xl:py-48" variant="quaternary">
              <div className="xl:flex xl:justify-between xl:gap-x-40">
                  <div>
                      <h2 className="text-2xl xl:text-4xl mb-10 font-light leading-[30px]">
                          Часті питання
                      </h2>
                  </div>
                  <div className="flex-1 divide-y-2 divide-black border-y-2 border-y-black text-xs xl:text-base">
                      {/*<Collapse*/}
                      {/*    title={*/}
                      {/*        <div className="text-sm xl:text-2xl">*/}
                      {/*            Скільки може <br /> коштувати річ?*/}
                      {/*        </div>*/}
                      {/*    }*/}
                      {/*>*/}
                      {/*    <p className="mb-5 text-gray-600">*/}
                      {/*        Якщо коротко: по-різному. Вишита сорочка, приміром, може*/}
                      {/*        коштувати від 1000 гривень до 2000 доларів — це залежить від*/}
                      {/*        рідкісності, складності технік та обсягу вишиття.*/}
                      {/*    </p>*/}
                      {/*    <p className="text-gray-600">*/}
                      {/*        Наша команда шукає предмети культурної спадщини шукає на*/}
                      {/*        відкритих майданчиках. Про кожну знайдену річ, що може мати*/}
                      {/*        потенційну цінність для збірки музею, ми повідомляємо*/}
                      {/*        представників Музею Івана Гончара. Рішення щодо купівлі приймає*/}
                      {/*        науковий персонал музею, а для речей вартістю від 50000 грн*/}
                      {/*        Музей залучає зовнішніх фахівців. Науковці та експерти*/}
                      {/*        враховують культурну цінність предмета й ціну, що встановлена*/}
                      {/*        продавцем, та визначають граничну ціну в разі проведення*/}
                      {/*        аукціону.*/}
                      {/*    </p>*/}
                      {/*</Collapse>*/}
                      {/*<Collapse*/}
                      {/*    title={*/}
                      {/*        <div className="text-sm xl:text-2xl">*/}
                      {/*            Ми шукаємо речі <br /> лише онлайн?*/}
                      {/*        </div>*/}
                      {/*    }*/}
                      {/*>*/}
                      {/*    <p className="text-gray-600">*/}
                      {/*        Так. Це пов’язано з декількома причинами:*/}
                      {/*    </p>*/}
                      {/*    <ul className="list-disc list-inside text-gray-600">*/}
                      {/*        <li>*/}
                      {/*            В інтернеті нам доступні декілька десятків джерел водночас,*/}
                      {/*            тож ми маємо великий вибір і можемо обрати найкраще.*/}
                      {/*            Етнографічні експедиції, з одного боку, обмежені регіоном, а з*/}
                      {/*            іншого — можуть не мати результату.*/}
                      {/*        </li>*/}
                      {/*        <li>*/}
                      {/*            Купівлі через інтернет є прозорішими для звітування. Ви можете*/}
                      {/*            відслідкувати, у кого було придбано річ та за яку ціну. З*/}
                      {/*            розвитком проєкту, можливо, це зміниться. Якщо ви готові задля*/}
                      {/*            «Спільного спадку» їздити в етнографічні експедиції —*/}
                      {/*            зв’яжіться з нами.*/}
                      {/*        </li>*/}
                      {/*    </ul>*/}
                      {/*</Collapse>*/}
                      {/*<Collapse*/}
                      {/*    title={*/}
                      {/*        <div className="text-sm xl:text-2xl">*/}
                      {/*            Чому ми обрали Музей Івана <br /> Гончара для співпраці?*/}
                      {/*        </div>*/}
                      {/*    }*/}
                      {/*>*/}
                      {/*    <p className="mb-5 text-gray-600">*/}
                      {/*        Будемо відверті: ми закохані в цей музей, адже він не*/}
                      {/*        консервується, а навпаки — підтримує ідею живої традиції та*/}
                      {/*        завжди залишається актуальним. Музей робить безліч колаборацій,*/}
                      {/*        як-то із Vogue або з ЦУМ, оцифровує власні фонди й створює схеми*/}
                      {/*        кроїв та вишивок для активного поширення традиції, проводить*/}
                      {/*        лекції та майстеркласи, досліджує та популяризує українську*/}
                      {/*        традиційну культуру.*/}
                      {/*    </p>*/}
                      {/*    <p className="text-gray-600">*/}
                      {/*        З розвитком проєкту ми можемо залучити інші музеї або*/}
                      {/*        етнографічні збірки. Про це ми обов’язково вас повідомимо.*/}
                      {/*    </p>*/}
                      {/*</Collapse>*/}
                      {/*<Collapse*/}
                      {/*    title={*/}
                      {/*        <div className="text-sm xl:text-2xl">*/}
                      {/*            Як фінансується Музей Івана <br /> Гончара та які має джерела*/}
                      {/*            витрат?*/}
                      {/*        </div>*/}
                      {/*    }*/}
                      {/*>*/}
                      {/*    <p className="mb-5 text-gray-600">*/}
                      {/*        Сьогодні Музей Івана Гончара є державною інституцією, що*/}
                      {/*        фінансується з держбюджету. Втім, комплектування фондової збірки*/}
                      {/*        та експедиції, які можуть бути джерелом поповнення музейних*/}
                      {/*        предметів, не фінансуються.*/}
                      {/*    </p>*/}
                      {/*    <p className="text-gray-600">*/}
                      {/*        В основі Музею — приватна збірка Івана Гончара, яку засновник*/}
                      {/*        зібрав у 1950-1980-х роках власним коштом та в експедиціях. За*/}
                      {/*        роки діяльності музею як державного, його фондова збірка була*/}
                      {/*        втричі збільшена коштом родини Гончарів-Матвієнків, поодиноких*/}
                      {/*        меценатів та дарувальників, а також в експедиціях, які*/}
                      {/*        здійснювали власним коштом співробітників та директора музею.*/}
                      {/*        Крім того, частково власні приватні збірки до музею подарували*/}
                      {/*        колекціонери: родина Причепіїв, Микола Бабак, Володимир*/}
                      {/*        Титаренко, Володимир Козюк, Ігор Перевертнюк.*/}
                      {/*    </p>*/}
                      {/*</Collapse>*/}
                      {/*<Collapse*/}
                      {/*    title={*/}
                      {/*        <div className="text-sm xl:text-2xl">*/}
                      {/*            Як забезпечуватимете цільове <br /> використання коштів?*/}
                      {/*        </div>*/}
                      {/*    }*/}
                      {/*>*/}
                      {/*    <p className="mb-5 text-gray-600">*/}
                      {/*        Для того, щоб налагодити прозору звітність перед Музеєм,*/}
                      {/*        меценатами та державними органами, ми уклали угоду з благодійним*/}
                      {/*        фондом «КОЛО». Цей фонд існує з 2013 року, спільно з Музеєм*/}
                      {/*        Івана Гончара за цей час реалізовано багато важливих проєктів, в*/}
                      {/*        тому числі масштабування діяльності дитячої студії «ОРЕЛІ»,*/}
                      {/*        створення онлайн-курсу про традиційну українську культуру «Знай*/}
                      {/*        свою Україну».*/}
                      {/*    </p>*/}
                      {/*    <p className="text-gray-600">*/}
                      {/*        Згідно з угодою, команда «Спільного спадку» не має доступу до*/}
                      {/*        коштів меценатів, що ті перераховують через платформу Patreon —*/}
                      {/*        ці кошти на власний банківський рахунок отримує «КОЛО». Коли*/}
                      {/*        наша кураторка погоджує із представниками Музею купівлю речі, її*/}
                      {/*        викуп здійснюють безпосередньо представники Фонду, і далі саме*/}
                      {/*        вони передають річ Музею. Звітність, яку ми публікуватимемо*/}
                      {/*        щомісяця, базуватиметься на даних Фонду, що будуть погоджені з*/}
                      {/*        його представниками.*/}
                      {/*    </p>*/}
                      {/*</Collapse>*/}
                      {/*<Collapse*/}
                      {/*    title={*/}
                      {/*        <div className="text-sm xl:text-2xl">*/}
                      {/*            Що таке Patreon та <br /> як ним користуватися?*/}
                      {/*        </div>*/}
                      {/*    }*/}
                      {/*>*/}
                      {/*    <p className="mb-5 text-gray-600">*/}
                      {/*        Patreon — це платформа, що працює за принципом членства. Вона*/}
                      {/*        допомагає ініціативам або авторам отримувати стабільні*/}
                      {/*        надходження завдяки щомісячним внескам людей. Щоб стати*/}
                      {/*        меценатом «Спільного спадку» на Patreon та підтримати*/}
                      {/*        ініціативу, достатньо оформити щомісячний внесок. Для цього*/}
                      {/*        зареєструйтеся чи авторизуйтеся на{' '}*/}
                      {/*        <Link*/}
                      {/*            className="underline"*/}
                      {/*            target="_blank"*/}
                      {/*            rel="noreferrer"*/}
                      {/*            href="https://www.patreon.com/spilnyi_spadok"*/}
                      {/*        >*/}
                      {/*            patreon.com*/}
                      {/*        </Link>{' '}*/}
                      {/*        і вкажіть свої дані та бажану суму внеску.*/}
                      {/*    </p>*/}
                      {/*    <div className="mb-5 text-gray-600">*/}
                      {/*        <p className="mb-5">Подивіться відео, як це можна зробити:</p>*/}
                      {/*        <YouTube*/}
                      {/*            videoId="TwaJt_2CCrg"*/}
                      {/*            iframeClassName="w-full aspect-video"*/}
                      {/*        />*/}
                      {/*    </div>*/}
                      {/*    <p className="mb-5 text-gray-600">*/}
                      {/*        Ви можете змінити суму внеску або скасувати передплату у*/}
                      {/*        будь-яку мить.*/}
                      {/*    </p>*/}
                      {/*    <p className="text-gray-600">*/}
                      {/*        Ми обрали платформу Patreon з декількох причин:*/}
                      {/*    </p>*/}
                      {/*    <ul className="list-disc list-inside text-gray-600">*/}
                      {/*        <li>*/}
                      {/*            Вона офіційна та підзвітна. Ви будете бачити, скільки коштів*/}
                      {/*            отримав «Спільний спадок», зі звіту, який формує сама*/}
                      {/*            платформа.*/}
                      {/*        </li>*/}
                      {/*        <li>*/}
                      {/*            На платформі ви та команда проєкту може переглядати список*/}
                      {/*            членів. Так, ініціатива знатиме своїх меценатів та зможе з*/}
                      {/*            ними контакувати.*/}
                      {/*        </li>*/}
                      {/*        <li>*/}
                      {/*            Щомісячні внески гарантують стабільність надходжень. Завдяки*/}
                      {/*            цьому ми зможемо поповнювати музейні збірки регулярно.*/}
                      {/*        </li>*/}
                      {/*    </ul>*/}
                      {/*</Collapse>*/}
                  </div>
              </div>
          </Section>
          <Section className="py-6 xl:py-16" variant="quinary" inset={false}>
              <footer className="flex flex-wrap justify-between gap-y-10 gap-x-10 text-xs">
                  <div>
                      <h4 className="text-sm xl:text-2xl mb-3.5 xl:mb-5">
                          Спільний спадок
                      </h4>
                      <ul className="text-gray-600">
                          <li className="mb-1 xl:mb-2.5">
                              <Link
                                  href="mailto:welcome@spadok.foundation"
                                  className="underline"
                              >
                                  welcome@spadok.foundation
                              </Link>
                          </li>
                          <li className="mb-1 xl:mb-2.5">
                              <Link
                                  href="https://www.facebook.com/spilnyi.spadok"
                                  className="underline"
                                  target="_blank"
                              >
                                  facebook
                              </Link>
                          </li>
                          <li className="mb-1 xl:mb-2.5">
                              <Link
                                  href="https://instagram.com/spilnyi.spadok"
                                  className="underline"
                                  target="_blank"
                              >
                                  instagram
                              </Link>
                          </li>
                      </ul>
                  </div>
                  <div>
                      <h4 className="text-sm xl:text-2xl mb-3.5 xl:mb-5">
                          Музей Івана Гончара
                      </h4>
                      <ul className="text-gray-600">
                          <li className="mb-1 xl:mb-2.5">
                              <Link
                                  href="https://honchar.org.ua"
                                  className="underline"
                                  target="_blank"
                              >
                                  honchar.org.ua
                              </Link>
                          </li>
                          <li className="mb-1 xl:mb-2.5">
                              <Link
                                  href="https://facebook.com/honcharmuseum"
                                  className="underline"
                                  target="_blank"
                              >
                                  facebook
                              </Link>
                          </li>
                          <li className="mb-1 xl:mb-2.5">
                              <Link
                                  href="https://instagram.com/honchar.museum"
                                  className="underline"
                                  target="_blank"
                              >
                                  instagram
                              </Link>
                          </li>
                      </ul>
                  </div>
                  <div>
                      <h4 className="text-sm xl:text-2xl mb-3.5 xl:mb-5">
                          Благодійний фонд «КОЛО»
                      </h4>
                      <ul className="text-gray-600">
                          <li className="mb-1 xl:mb-2.5">
                              <Link
                                  href="https://www.kolo.fund"
                                  className="underline"
                                  target="_blank"
                              >
                                  kolo.fund
                              </Link>
                          </li>
                          <li className="mb-1 xl:mb-2.5">
                              <Link
                                  href="https://www.facebook.com/kolofund"
                                  className="underline"
                                  target="_blank"
                              >
                                  facebook
                              </Link>
                          </li>
                          <li className="mb-1 xl:mb-2.5">
                              <Link
                                  href="https://www.instagram.com/kolo_fund"
                                  className="underline"
                                  target="_blank"
                              >
                                  instagram
                              </Link>
                          </li>
                      </ul>
                  </div>
                  <p className="min-w-full">
                      Спільний спадок © {new Date().getFullYear()}
                  </p>
              </footer>
          </Section>
      </main>
  );
}
