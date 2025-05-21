import { useAppStore } from "@/app.store";
import wallet from "./images/wallet.png";
import moneyKeeper1 from "./images/money_keeper_1.png";
import moneyKeeper2 from "./images/money_keeper_2.png";
import bag1 from "./images/bag1.png";
import bag2 from "./images/bag2.png";
import bag3 from "./images/bag3.png";
import cardholder1 from "./images/cardholder1.png";
import cardholder2 from "./images/cardholder2.png";
import cardholder3 from "./images/cardholder3.png";
import backpack1 from "./images/backpack1.png";
import backpack2 from "./images/backpack2.png";
import backpack3 from "./images/backpack3.png";
import backpack4 from "./images/backpack4.png";
import backpack5 from "./images/backpack5.png";
import backpack6 from "./images/backpack6.png";
import backpack7 from "./images/backpack7.png";
import backpack8 from "./images/backpack8.png";
import backpack9 from "./images/backpack9.png";
import backpack10 from "./images/backpack10.png";
import backpack11 from "./images/backpack11.png";
import backpack12 from "./images/backpack12.png";
import { Dialog } from "@radix-ui/themes";

export function Search() {
  const { query, setQuery } = useAppStore();

  const filtered = templates.filter((template) =>
    template.name.toLowerCase().includes(query)
  );

  return (
    <div className="">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value.toLowerCase())}
        type="search"
        className="bg-neutral-100 w-full p-2 rounded-xl mb-4 sticky top-6 border border-neutral-300"
        placeholder="Введите название шаблона"
      />
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? "Ничего не найдено" : null}
        {filtered.map((template) => (
          <div
            key={template.id}
            className="border border-neutral-100 bg-neutral-50 p-4 rounded-2xl"
          >
            <span className="mb-4 text-lg block">{template.name}</span>
            <div
              className={`grid grid-cols-2 gap-2 ${
                template.images.length > 6 ? "grid-cols-3" : ""
              }`}
            >
              {template.images.map((image) => (
                <Dialog.Root>
                  <Dialog.Trigger>
                    <img
                      src={image}
                      key={image}
                      className="aspect-square object-cover border border-neutral-300 rounded-3xl cursor-zoom-in"
                    />
                  </Dialog.Trigger>
                  <Dialog.Content>
                    <img
                      src={image}
                      key={image}
                      className="h-[80vh] object-cover rounded-3xl mx-auto"
                    />
                  </Dialog.Content>
                </Dialog.Root>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const templates = [
  {
    id: 1,
    name: "Кошелёк",
    images: [wallet],
  },
  {
    id: 2,
    name: "Зажим для денег",
    images: [moneyKeeper1, moneyKeeper2],
  },
  {
    id: 3,
    name: "Сумка",
    images: [bag1, bag2, bag3],
  },
  {
    id: 4,
    name: "Картхолдер",
    images: [cardholder1, cardholder2, cardholder3],
  },
  {
    id: 5,
    name: "Рюкзак",
    images: [
      backpack1,
      backpack2,
      backpack3,
      backpack4,
      backpack5,
      backpack6,
      backpack7,
      backpack8,
      backpack9,
      backpack10,
      backpack11,
      backpack12,
    ],
  },
];
