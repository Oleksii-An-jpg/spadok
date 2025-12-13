'use server'
import Section from "@/components/section";
import Link from "next/link";
import BrandButton from "@/components/brand/button";
import {Logo} from "@/components/logo";
import {
    Heading, Link as ChakraLink, VStack, Grid, Bleed
} from "@chakra-ui/react";
import {getFounds} from "@/api/founds";
import {getDisplayPrice} from "@/lib/price";
import Avatar from "@/components/avatar";
import Members from "@/components/members";
import QNA from "@/components/q&a";
import {getCategories} from "@/api/categories";
import Collection from "@/components/collection";
import Banner from "@/components/banner";
import {Filter} from "firebase-admin/firestore";

const MEMBERS = [
    {
        photo: "/photos/alina.png",
        name: "Аліна Божнюк",
        role: "Співзасновниця та кураторка",
        description: "Ініціаторка «Спільного спадку». Колекціонерка українського народного вбрання, поціновувачка старовини. Обожнює, коли люди об’єднуються та створюють щось нове і суспільно важливе. Менеджерка в креативних сферах та просто добра людина.",
        instagram: "https://www.instagram.com/bozhnyuk/",
    },
    {
        photo: "/photos/hanna.png",
        name: "Аня Кащеєва",
        role: "Співзасновниця та креативна директорка",
        description: "Креаторка, лекторка з копірайтингу, призерка фестивалю креативності Cannes Lions, шанувальниця гарних ідей і добрих людей.",
        instagram: "https://instagram.com/litttlepony",
    },
    {
        photo: "/photos/oleksii.png",
        name: "Олексій Ан",
        role: "Технічний директор та веб-розробник",
        description: "Айтівець з часів, коли ніхто не знав, що таке айті, Front End викладач, дослідник кулінарії, велосипедист, сноубордист та гірський ентузіаст.",
        instagram: "https://instagram.com/oleksii.an",
    },
    {
        photo: "/photos/hanna_iatel.png",
        name: "Ганна Ятель",
        role: "Менеджерка з комунікацій",
        description: "Маркетологиня цифрових продуктів. Поціновувачка усього аналогового: рослин, культурної спадщини, людей.",
        instagram: "https://www.instagram.com/a_yatel",
    },
    {
        photo: "/photos/oksana.png",
        name: "Оксана Тригуб",
        role: "Менеджерка з пошуку речей",
        description: "Художниця та дизайнерка. Любить малювати скетчі у кав'ярнях, особливо, якщо там є великі фікуси. Колекціонує народні рушники, вишиті нерахунковими видами гладі.",
        instagram: "https://www.instagram.com/art_traditional_ua",
    },
    {
        photo: "/photos/iuliia.png",
        name: "Юлія Люлько",
        role: "Менеджерка",
        description: "Музейниця, поціновувачка книг з естетичними ілюстраціями і цікавинок з вінтажних риночків. Виховує богемного кота Матісса, любить грати у «Що? Де? Коли?» і створювати ялинкові прикраси.",
        instagram: "https://www.instagram.com/la_vi_13",
    },
    {
        photo: "/photos/illia.png",
        name: "Ілля Почкун",
        role: "Автор візуального стилю",
        description: "Співзасновник креативної агенції Taktika, музикант, художник, друг всіх тварин і володар дитячого розряду з айкідо.",
        instagram: "https://instagram.com/pochkun",
    },
    {
        photo: "/photos/olena.png",
        name: "Олена Довгопол",
        role: "Дизайнерка",
        description: "Графічна дизайнерка, іллюстраторка, лекторка та видумщиця приколів.",
        instagram: "https://www.instagram.com/odovhopol",
    }
]

export default async function Home() {
    const [categories, founds] = await Promise.all([getCategories({
        filters: [Filter.and(Filter.where('isCollection', '==', true), Filter.where('isHomepage', '==', true))]
    }), getFounds()]);
  return (
      <Bleed inline="30px" block="10">
          <main className="text-sm xl:text-2xl font-extralight">
              <Section className="py-24 xl:py-48 text-center" variant="secondary">
                  <VStack mb={16}>
                      <Logo variant="secondary" />
                  </VStack>
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
                      <BrandButton decorated size="xl" variant="brand-secondary">
                          Доєднатися
                      </BrandButton>
                  </Link>
              </Section>
              <Section className="py-24 xl:py-48" variant="quaternary">
                  <div className="xl:flex xl:justify-between xl:gap-x-40">
                      <div>
                          <h2 className="text-2xl xl:text-4xl mb-6 font-light">
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
              <Section inset={false} className="py-24 xl:py-48 text-center" variant="secondary">
                  <Avatar
                      src="/photos/petro.png"
                      alt="Петро Гончар"
                      decorated
                      size="large"
                      priority
                  />
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
                          <h2 className="text-2xl xl:text-4xl mb-6 font-light whitespace-nowrap">
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
              <Section inset={false} className="py-24 xl:py-48 text-center" variant="primary">
                  <h2 className="text-2xl xl:text-4xl mb-6 xl:mb-8 font-light">
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
                      <BrandButton decorated size="xl" variant="brand-tertiary">
                          Доєднатися
                      </BrandButton>
                  </Link>
              </Section>
              <Section className="py-24 xl:py-48" variant="quaternary">
                  {founds && (
                      <div className="flex flex-wrap xl:flex-nowrap gap-x-2.5 gap-y-6 xl:gap-x-40">
                          <div className="basis-2/4">
                              <h3 className="text-xl xl:text-4xl mb-3 xl:mb-6 font-light whitespace-nowrap">
                                  Зібрано <br /> коштів
                              </h3>
                              {founds.raised ? (
                                  <h2 className="text-2xl xl:text-8xl">
                                      {getDisplayPrice(founds.raised)}
                                  </h2>
                              ) : (
                                  <p className="text-xs xl:text-base">
                                      Перші внески ми отримаємо на рахунок 05.03, на цей момент вони
                                      зберігаються на платформі Patreon
                                  </p>
                              )}
                          </div>
                          <div className="xl:basis-2/4">
                              <h3 className="text-xl xl:text-4xl mb-3 xl:mb-6 font-light whitespace-nowrap">
                                  Витрачено <br /> коштів
                              </h3>
                              <h2 className="text-2xl xl:text-8xl">
                                  {getDisplayPrice(founds.spent)}
                              </h2>
                          </div>
                      </div>
                  )}
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
                  <VStack mt={6} gap={16} align="stretch">
                      <Heading fontSize={{ base: 'xl', xl: '5xl' }} fontWeight="light">
                          Дослідіть наші колекції:
                      </Heading>
                      <Grid templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} className="[&>*]:hidden
  [&>*:nth-child(-n+8)]:block
  lg:[&>*:nth-child(-n+9)]:block" gap={4}>
                          {categories.map((item) => (
                              <Collection collection={item} key={item.id} />
                          ))}
                      </Grid>
                      <VStack>
                          <BrandButton asChild size="xl" variant="brand-primary">
                              <ChakraLink asChild>
                                  <Link href="/catalog">Перейти до каталогу</Link>
                              </ChakraLink>
                          </BrandButton>
                      </VStack>
                  </VStack>
              </Section>
              <Section className="py-24 xl:py-48" variant="quaternary">
                  <div className="xl:flex xl:justify-between xl:gap-x-40">
                      <div>
                          <h2 className="text-2xl xl:text-4xl mb-10 font-light">
                              Команда <br /> проєкту
                          </h2>
                      </div>
                      <div className="flex-1 divide-y-2 divide-black border-t-2 border-t-black">
                          <Members members={MEMBERS} />
                      </div>
                  </div>
              </Section>
              <Banner />
              <Section className="py-24 xl:py-48" variant="quaternary">
                  <div className="xl:flex xl:justify-between xl:gap-x-40">
                      <div>
                          <h2 className="text-2xl xl:text-4xl mb-10 font-light">
                              Часті питання
                          </h2>
                      </div>
                      <div className="flex-1 divide-y-2 divide-black border-t-2 border-t-black text-xs xl:text-base">
                          <QNA />
                      </div>
                  </div>
              </Section>
          </main>
      </Bleed>
  );
}
