import React from "react";
import Footer from "../../Footer/Footer";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaArrowRight } from "react-icons/fa";
import { BsDot, BsPlusLg, BsCheck2All } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { db } from "../../Utils/Firebase/Firebase";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import PopUp from "../../Popup/Popup";
import { DueDate } from "../../Popup/Popup";
import { toast } from "react-toastify";

export interface Task {
  id: string;
  title?: string;
  dueDate?: DueDate;
  priority?: string;
  description?: string;
  uid?: string | null;
}

export const getDateValue = (value: DueDate) => {
  const calc = new Date(value.seconds * 1000);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(calc);
};

const Goals = () => {
  const [modal, setModal] = React.useState(false);
  const [value, onChange] = React.useState(new Date());
  const handleDateChange = (date: any) => {
    onChange(date);
  };

  //fetch functionality
  const [data, setData] = React.useState<Task[]>([]);
  React.useEffect(() => {
    onSnapshot(collection(db, "goals"), (snapshot) => {
      setData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc?.id })));
      console.log(data);
    });
  }, []);

  //delete frunctionality -goals(collection name)
  const handleDelete = async (id: string) => {
    const docRef = doc(db, "goals", id);
    await deleteDoc(docRef);
    setTimeout(() => {
      toast.success("goal deleted successfully!");
    });
  };

  return (
    <main>
      <div className="px-5">
        <div className="flex lg:flex-row flex-col justify-between">
          <div className="leading-7">
            <h1 className="text-4xl font-semibold">Hello User, </h1>
            <p className="pt-2">What are your goals for today? </p>
          </div>
          <div>
            <div className="flex items-center justify-between py-3">
              <h3 className="flex items-center justify-center">
                <FaArrowRight className="text-lg mr-2 animate-verticalBounce" />
                <span className="text-background mr-2 font-semibold">
                  Select
                </span>
                a due date to for your goal
              </h3>
            </div>
            <Calendar onChange={handleDateChange} value={value} />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3 py-7">
          <div className="bg-slate-50 w-full rounded-lg p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center text-lg">
                  <BsDot className="mr-1 text-5xl text-background" />
                  Goals
                </div>
                <div className="bg-gray-100 h-7 w-7 ml-2  text-background flex items-center justify-center text-lg font-semibold rounded-full">
                  0
                </div>
              </div>

              <div
                onClick={() => setModal(true)}
                className="cursor-pointer bg-gray-100 h-7 w-7 ml-2 animate-bounce text-background flex items-center justify-center text-lg font-semibold rounded-full"
              >
                <BsPlusLg className="text-xl font-semibold" />
              </div>
            </div>
            <div className="h-1 rounded-full bg-card w-full"></div>

            <div className=" text-black py-3 gap-5 grid ">
              {data &&
                data.map((goals) => (
                  <div key={goals.id} className="bg-white p-4 rounded-md">
                    <div className="flex justify-between">
                      <div className=" bg-green-500 text-white rounded-sm text-xs w-fit p-1 flex justify-center items-center">
                        {goals.priority}
                      </div>
                      <div
                        className="text-lg cursor-pointer"
                        onClick={() => handleDelete(goals.id)}
                      >
                        <AiOutlineDelete />
                      </div>
                    </div>
                    <h2 className="py-3 font-semibold">{goals.title}</h2>
                    <p className="text-xs">{goals.description}</p>

                    <h2 className="py-3 text-sm">
                      Due date:{" "}
                      {goals.dueDate ? getDateValue(goals.dueDate) : ""}
                    </h2>
                    <div className="flex justify-end pt-3 text-lg cursor-pointer">
                      <FiEdit />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-black text-white w-full rounded-lg p-3">
            <div className="flex items-center">
              <div className="flex items-center text-lg">
                <BsDot className="mr-1 text-5xl text-white" />
                Pending
              </div>
              <div className="bg-white h-7 w-7 ml-2  text-black flex items-center justify-center text-lg font-semibold rounded-full">
                0
              </div>
            </div>
            <div className="h-1 rounded-full bg-white w-full"></div>
            <div className=" text-black py-3 gap-5 grid ">
              {data &&
                data.map((goals) => (
                  <div key={goals.id} className="bg-white p-4 rounded-md">
                    <div className="flex justify-between">
                      <div className=" bg-green-500 text-white rounded-sm text-xs w-fit p-1 flex justify-center items-center">
                        {goals.priority}
                      </div>
                    </div>
                    <h2 className="py-3 font-semibold">{goals.title}</h2>
                    <p className="text-xs">{goals.description}</p>
                    <h2 className="py-4 text-sm">
                      Due date:{" "}
                      {goals.dueDate ? getDateValue(goals.dueDate) : ""}
                    </h2>
                    <div className="flex border-b hover:border-b-2 cursor-pointer border-black justify-end items-center text-sm">
                      Mark as Completed <BsCheck2All className="ml-2 text-lg" />{" "}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-slate-50 text-black w-full rounded-lg p-3">
            <div className="flex items-center">
              <div className="flex items-center text-lg">
                <BsDot className="mr-1 text-5xl text-background" />
                Achieved
              </div>
              <div className="bg-gray-100 h-7 w-7 ml-2  text-background flex items-center justify-center text-lg font-semibold rounded-full">
                0
              </div>
            </div>
            <div className="h-1 rounded-full bg-card w-full"></div>
          </div>
        </div>
      </div>
      <div className="border-t">
        <Footer />
      </div>
      <PopUp
        modal={modal}
        handleModal={() => setModal(false)}
        value={value}
        collectionName="goals"
      />
    </main>
  );
};
export default Goals;
