'use client';
import {FC} from "react";
import {Accordion, Text, useAccordionItemContext, Icon, HStack} from "@chakra-ui/react";
import {BiMinus, BiPlus} from "react-icons/bi";
import Link from "next/link";
import YouTube from 'react-youtube';

const AccordionItemIcon = () => {
    const { expanded } = useAccordionItemContext();

    return <Icon size="lg">
        {expanded ? <BiMinus /> : <BiPlus />}
    </Icon>
}

const QNA: FC = () => {
    return <Accordion.Root multiple size="lg">
        <Accordion.Item css={{ borderBottomWidth: 2 }} value="g">
            <Accordion.ItemTrigger className="cursor-pointer">
                <HStack justify="space-between" w="full">
                    <Text fontSize="xl" fontWeight="extralight" lg={{ fontSize: '2xl' }}>Як ми обираємо речі?</Text>
                    <AccordionItemIcon />
                </HStack>
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
                <Accordion.ItemBody>
                    <p className="mb-5 text-gray-600">
                        Спочатку наша команда вивчає пропозиції онлайн (це можуть бути аукціони, оголошення від продавців у соцмережах, на OLX тощо) та бронює річ, далі відбувається погодження з науковими співробітниками музею щодо якості та цінності речі, потреби для колекції музею та об’єктивності ціни. Після цього ми викуповуємо річ. Ми не займаємося реставрацією речей, за потреби вона проводиться після передачі речі до музею кваліфікованими фахівцями.
                    </p>
                    <p className="text-gray-600">
                        На жаль, велика кількість традиційних речей, що колись були родинною реліквією, останніми роками через різні причини стає предметом перепродажів, нищиться або вивозиться за кордон. Так втрачається можливість дослідити й зберегти традиції сотень сіл з різних регіонів України. Ми не можемо повернути час назад, але можемо спробувати врятувати найцікавіші предмети, викуповуючи їх для зберігання й вивчення Музеєм Івана Гончара.
                    </p>
                </Accordion.ItemBody>
            </Accordion.ItemContent>
        </Accordion.Item>
        <Accordion.Item css={{ borderBottomWidth: 2 }} value="a">
            <Accordion.ItemTrigger className="cursor-pointer">
                <HStack justify="space-between" w="full">
                    <Text fontSize="xl" fontWeight="extralight" lg={{ fontSize: '2xl' }}>Скільки може коштувати річ?</Text>
                    <AccordionItemIcon />
                </HStack>
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
                <Accordion.ItemBody>
                    <p className="mb-5 text-gray-600">
                        Якщо коротко: по-різному. Вишита сорочка, приміром, може коштувати від 1000 гривень до 2000 доларів — це залежить від рідкісності, складності технік та обсягу вишиття.
                    </p>
                    <p className="text-gray-600">
                        Наша команда шукає предмети культурної спадщини на відкритих майданчиках. Про кожну знайдену річ, що може мати потенційну цінність для збірки музею, ми повідомляємо представників Музею Івана Гончара. Рішення щодо купівлі приймає науковий персонал музею, а для речей вартістю від 50000 грн Музей залучає зовнішніх фахівців. Науковці та експерти враховують культурну цінність предмета й ціну, що встановлена продавцем, та визначають граничну ціну в разі проведення аукціону.
                    </p>
                </Accordion.ItemBody>
            </Accordion.ItemContent>
        </Accordion.Item>
        <Accordion.Item css={{ borderBottomWidth: 2 }} value="b">
            <Accordion.ItemTrigger className="cursor-pointer">
                <HStack justify="space-between" w="full">
                    <Text fontSize="xl" fontWeight="extralight" lg={{ fontSize: '2xl' }}>Ми шукаємо речі лише онлайн?</Text>
                    <AccordionItemIcon />
                </HStack>
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
                <Accordion.ItemBody>
                    <p className="text-gray-600">
                        Так. Це пов’язано з декількома причинами:
                    </p>
                    <ul className="list-disc list-inside text-gray-600">
                        <li>
                            В інтернеті нам доступні декілька десятків джерел водночас,
                            тож ми маємо великий вибір і можемо обрати найкраще.
                            Етнографічні експедиції, з одного боку, обмежені регіоном, а з
                            іншого — можуть не мати результату.
                        </li>
                        <li>
                            Купівлі через інтернет є прозорішими для звітування. Ви можете
                            відслідкувати, у кого було придбано річ та за яку ціну. З
                            розвитком проєкту, можливо, це зміниться. Якщо ви готові задля
                            «Спільного спадку» їздити в етнографічні експедиції —
                            зв’яжіться з нами.
                        </li>
                    </ul>
                </Accordion.ItemBody>
            </Accordion.ItemContent>
        </Accordion.Item>
        <Accordion.Item css={{ borderBottomWidth: 2 }} value="c">
            <Accordion.ItemTrigger className="cursor-pointer">
                <HStack justify="space-between" w="full">
                    <Text fontSize="xl" fontWeight="extralight" lg={{ fontSize: '2xl' }}>Чому ми обрали Музей Івана Гончара для співпраці?</Text>
                    <AccordionItemIcon />
                </HStack>
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
                <Accordion.ItemBody>
                    <p className="mb-5 text-gray-600">
                        Будемо відверті: ми закохані в цей музей, адже він не
                        консервується, а навпаки — підтримує ідею живої традиції та
                        завжди залишається актуальним. Музей робить безліч колаборацій,
                        як-то із Vogue або з ЦУМ, оцифровує власні фонди й створює схеми
                        кроїв та вишивок для активного поширення традиції, проводить
                        лекції та майстеркласи, досліджує та популяризує українську
                        традиційну культуру.
                    </p>
                    <p className="text-gray-600">
                        З розвитком проєкту ми можемо залучити інші музеї або
                        етнографічні збірки. Про це ми обов’язково вас повідомимо.
                    </p>
                </Accordion.ItemBody>
            </Accordion.ItemContent>
        </Accordion.Item>
        <Accordion.Item css={{ borderBottomWidth: 2 }} value="d">
            <Accordion.ItemTrigger className="cursor-pointer">
                <HStack justify="space-between" w="full">
                    <Text fontSize="xl" fontWeight="extralight" lg={{ fontSize: '2xl' }}>Як фінансується Музей Івана Гончара та які має джерела витрат?</Text>
                    <AccordionItemIcon />
                </HStack>
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
                <Accordion.ItemBody>
                    <p className="mb-5 text-gray-600">
                        Сьогодні Музей Івана Гончара є державною інституцією, що
                        фінансується з держбюджету. Втім, комплектування фондової збірки
                        та експедиції, які можуть бути джерелом поповнення музейних
                        предметів, не фінансуються.
                    </p>
                    <p className="text-gray-600">
                        В основі Музею — приватна збірка Івана Гончара, яку засновник
                        зібрав у 1950-1980-х роках власним коштом та в експедиціях. За
                        роки діяльності музею як державного, його фондова збірка була
                        втричі збільшена коштом родини Гончарів-Матвієнків, поодиноких
                        меценатів та дарувальників, а також в експедиціях, які
                        здійснювали власним коштом співробітників та директора музею.
                        Крім того, частково власні приватні збірки до музею подарували
                        колекціонери: родина Причепіїв, Микола Бабак, Володимир
                        Титаренко, Володимир Козюк, Ігор Перевертнюк.
                    </p>
                </Accordion.ItemBody>
            </Accordion.ItemContent>
        </Accordion.Item>
        <Accordion.Item css={{ borderBottomWidth: 2 }} value="e">
            <Accordion.ItemTrigger className="cursor-pointer">
                <HStack justify="space-between" w="full">
                    <Text fontSize="xl" fontWeight="extralight" lg={{ fontSize: '2xl' }}>Як забезпечуватимете цільове використання коштів?</Text>
                    <AccordionItemIcon />
                </HStack>
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
                <Accordion.ItemBody>
                    <p className="mb-5 text-gray-600">
                        Для того, щоб налагодити прозору звітність перед Музеєм,
                        меценатами та державними органами, ми уклали угоду з благодійним
                        фондом «КОЛО». Цей фонд існує з 2013 року, спільно з Музеєм
                        Івана Гончара за цей час реалізовано багато важливих проєктів, в
                        тому числі масштабування діяльності дитячої студії «ОРЕЛІ»,
                        створення онлайн-курсу про традиційну українську культуру «Знай
                        свою Україну».
                    </p>
                    <p className="text-gray-600">
                        Згідно з угодою, команда «Спільного спадку» не має доступу до
                        коштів меценатів, що ті перераховують через платформу Patreon —
                        ці кошти на власний банківський рахунок отримує «КОЛО». Коли
                        наша кураторка погоджує із представниками Музею купівлю речі, її
                        викуп здійснюють безпосередньо представники Фонду, і далі саме
                        вони передають річ Музею. Звітність, яку ми публікуватимемо
                        щомісяця, базуватиметься на даних Фонду, що будуть погоджені з
                        його представниками.
                    </p>
                </Accordion.ItemBody>
            </Accordion.ItemContent>
        </Accordion.Item>
        <Accordion.Item css={{ borderBottomWidth: 2 }} value="f">
            <Accordion.ItemTrigger className="cursor-pointer">
                <HStack justify="space-between" w="full">
                    <Text fontSize="xl" fontWeight="extralight" lg={{ fontSize: '2xl' }}>Що таке Patreon та як ним користуватися?</Text>
                    <AccordionItemIcon />
                </HStack>
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
                <Accordion.ItemBody>
                    <p className="mb-5 text-gray-600">
                        Patreon — це платформа, що працює за принципом членства. Вона
                        допомагає ініціативам або авторам отримувати стабільні
                        надходження завдяки щомісячним внескам людей. Щоб стати
                        меценатом «Спільного спадку» на Patreon та підтримати
                        ініціативу, достатньо оформити щомісячний внесок. Для цього
                        зареєструйтеся чи авторизуйтеся на{' '}
                        <Link
                            className="underline"
                            target="_blank"
                            rel="noreferrer"
                            href="https://www.patreon.com/spilnyi_spadok"
                        >
                            patreon.com
                        </Link>{' '}
                        і вкажіть свої дані та бажану суму внеску.
                    </p>
                    <div className="mb-5 text-gray-600">
                        <p className="mb-5">Подивіться відео, як це можна зробити:</p>
                        <YouTube
                            videoId="TwaJt_2CCrg"
                            iframeClassName="w-full aspect-video"
                        />
                    </div>
                    <p className="mb-5 text-gray-600">
                        Ви можете змінити суму внеску або скасувати передплату у
                        будь-яку мить.
                    </p>
                    <p className="text-gray-600">
                        Ми обрали платформу Patreon з декількох причин:
                    </p>
                    <ul className="list-disc list-inside text-gray-600">
                        <li>
                            Вона офіційна та підзвітна. Ви будете бачити, скільки коштів
                            отримав «Спільний спадок», зі звіту, який формує сама
                            платформа.
                        </li>
                        <li>
                            На платформі ви та команда проєкту може переглядати список членів. Так ініціатива знатиме своїх меценатів та зможе з ними контакувати.
                        </li>
                        <li>
                            Щомісячні внески гарантують стабільність надходжень. Завдяки
                            цьому ми зможемо поповнювати музейні збірки регулярно.
                        </li>
                    </ul>
                </Accordion.ItemBody>
            </Accordion.ItemContent>
        </Accordion.Item>
    </Accordion.Root>
};

export default QNA;