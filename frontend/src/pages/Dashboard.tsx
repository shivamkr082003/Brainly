import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import { useEffect, useState } from "react";
import Sidebar from "../components/ui/Sidebar";
import DashNav from "../components/ui/DashNav";
import axios from "axios";
import { useFilter } from "../contexts/FilterContext";
const apiUrl = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contents, setContents] = useState<any[]>([]);
  
  const { filter } = useFilter();


  const token = localStorage.getItem("token");

  interface ContentResponse {
    contents: any[];
  }

  const deleteContent = async (id: string) => {
    try {
      await axios.delete(`${apiUrl}/content`, {
        //@ts-ignore
        data: { contentId: id },
        headers: {
          Authorization: `${token}`,
        },
      });

      fetchContents();
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  const fetchContents = async () => {
    if (token) {
      const response = await axios.get<ContentResponse>(`${apiUrl}/content`, {
        headers: {
          Authorization: token,
        },
        params: {
          filter,
        },
      });
      const data = response.data.contents;
      setContents(data);      
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  useEffect(() => {
    fetchContents();
  }, [filter]);

  return (
    <>
      <div>
        <Modal
          value={isOpen}
          onSubmitFn={fetchContents}
          onClickFn={() => {
            setIsOpen(false);
          }}
        />
        <Sidebar
          setModal={() => {
            setIsOpen(true);
          }}
          menuOpen={menuOpen}
          setMenuOpen={() => {
            setMenuOpen(false);
          }}
        />
        <div className={`min-w-screen min-h-screen `}>
          <div className="py-5 ">
            <DashNav
              menuOpen={menuOpen}
              setMenuOpen={() => {
                setMenuOpen(true);
              }}
            />
          </div>

          <div className="w-full h-full  text-primary flex flex-wrap items-start justify-center p-3 gap-4">
            {contents.length === 0 ? (
              <div className="text-center flex justify-center items-center font-semibold text-xl h-[70vh]">
                <p>No contents available yet! Open Menu to add content.</p>
              </div>
            ) : (
              <div className="w-full h-full text-primary flex flex-wrap items-start justify-center p-3 gap-4">
                {contents.map((content) => (
                  <Card
                    key={content._id}
                    title={content.title}
                    link={content.link}
                    type={content.type}
                    deleteFn={() => deleteContent(content._id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
