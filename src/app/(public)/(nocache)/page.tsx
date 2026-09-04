'use server'
import Section from "@/components/section";
import Link from "next/link";
import BrandButton from "@/components/brand/button";
import {Logo} from "@/components/logo";
import {
    Link as ChakraLink, VStack, Grid, Bleed
} from "@chakra-ui/react";
import {getFounds} from "@/api/founds";
import {getDisplayPrice} from "@/lib/price";
import Members from "@/components/members";
import {getMembers} from "@/api/members";
import QNA from "@/components/q&a";
import {getCategories} from "@/api/categories";
import Collection from "@/components/collection";
import Banner from "@/components/banner";
import {Filter} from "firebase-admin/firestore";

export default async function Home() {
    const [categories, founds, members] = await Promise.all([getCategories({
        filters: [Filter.and(Filter.where('isCollection', '==', true), Filter.where('isHomepage', '==', true))]
    }), getFounds(), getMembers()]);
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
                          Доєднатися до спільноти
                      </BrandButton>
                  </Link>
              </Section>
              <Section className="pt-24 xl:pt-48" variant="quaternary">
                  <div className="xl:flex xl:justify-between xl:gap-x-40">
                      <div>
                          <h2 className="text-2xl xl:text-4xl mb-6 font-light">
                              Які музеї ми <br /> підтримуємо?
                          </h2>
                      </div>
                      <div>
                          <p className="mb-3.5">
                              Наразі ми співпрацюємо з Національним центром народної культури «Музей Івана Гончара» в Києві. Музей було створено не державою, а зусиллями митця, етнографа й колекціонера Івана Гончара, який прагнув зберегти культурну спадщину України всупереч заборонам радянської влади. Нам дуже імпонує цей підхід, адже вважаємо, що збереження національних традицій та ідентичності зазвичай відбувається саме завдяки зусиллям небайдужих людей.
                          </p>
                          <p>
                              Від моменту заснування проєкту на початку 2023 року ми врятували й передали до Музею Івана Гончара понад 200 предметів народного вбрання, народних картин та ікон, давніх світлин та рушників з різних регіонів України.
                          </p>
                      </div>
                  </div>
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
                  <VStack mt={24} gap={6} align="stretch">
                      <h2 className="text-2xl xl:text-4xl mb-0 font-light">
                          Дослідіть наші колекції:
                      </h2>
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
                                  <Link prefetch={false} href="/catalog">Каталог</Link>
                              </ChakraLink>
                          </BrandButton>
                      </VStack>
                  </VStack>
              </Section>
              <Section inset={false} className="py-24 xl:py-48 text-center" variant="primary">
                  <h2 className="text-2xl xl:text-4xl mb-6 xl:mb-8 font-light">
                      Як доєднатися?
                  </h2>
                  <p className="mb-3.5">
                      Щоб долучитися до проєкту, можна оформити передплату на Patreon. Усі зібрані кошти ми спрямовуємо на купівлю речей та сплату податків. Команда «Спільного спадку» працює безоплатно та регулярно звітує:
                  </p>
                  <ul className="mb-8 xl:mb-16 list-disc list-inside">
                      <li>
                          Щоквартально ми публікуємо детальний звіт про всі зібрані та витрачені кошти на цьому сайті.
                      </li>
                      <li>
                          Впродовж місяця після купівлі кожної з речей ми детально звітуємо на нашому Patreon: додаємо фото речі, пояснюємо її цінність та вказуємо вартість.
                      </li>
                  </ul>
                  <Link
                      className="inline-block p-5"
                      href="https://www.patreon.com/spilnyi_spadok"
                      target="_blank"
                  >
                      <BrandButton decorated size="xl" variant="brand-tertiary">
                          Стати меценатом
                      </BrandButton>
                  </Link>
              </Section>
              <Section className="py-24 xl:py-48" variant="quaternary">
                  <div className="xl:flex xl:justify-between xl:gap-x-40">
                      <div>
                          <h2 className="text-2xl xl:text-4xl mb-10 font-light">
                              Команда <br /> проєкту
                          </h2>
                      </div>
                      <div className="flex-1 divide-y-2 divide-black border-t-2 border-t-black">
                          <Members members={members} />
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
