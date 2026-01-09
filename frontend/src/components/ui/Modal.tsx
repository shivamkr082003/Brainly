import CloseIcon from "../icons/CloseIcon";
import InputBox from "./InputBox";
import Button from "./Button";
import { useRef, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

interface ModalProps {
  value: boolean;
  onClickFn: () => void;
  onSubmitFn:()=>void;
}
 
const Modal = (props: ModalProps) => {
  const titleRef = useRef<HTMLInputElement>();
  const linkRef = useRef<HTMLInputElement>();
  const [message, setMessage] = useState<string | null>(null); 

  const onSubmit = async () => {
    const token = localStorage.getItem("token");
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;
    const type = (document.getElementById("type") as HTMLSelectElement)?.value;

    interface ResponseData {
      message: string;
    }

    try {
      const response = await axios.post<ResponseData>(
        `${apiUrl }/content`,
        {
          title,
          link,
          type,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
     // Success - Set the success message

    

     setMessage(response.data?.message || "Content added successfully.");
    } catch (error: any) {
      // Error - Set the error message
      if (error.response) {
        setMessage(error.response.data?.message || error.response.statusText);
      } else if (error.request) {
        setMessage("Network error: No response from server.");
      } else {
        setMessage(error.message);
      }
    }
    props.onSubmitFn();
  };
  

  return (
    <div
      className={`h-full w-full bg-black bg-opacity-50 fixed top-0 left-0 flex justify-center items-center z-20 ${
        props.value ? " " : " hidden "
      }`}>
      <div className="w-80 h-96 md:w-96 bg-secondary rounded-lg">
        <div className="h-14 flex justify-end p-3">
          <div className="cursor-pointer" onClick={props.onClickFn}>
            <CloseIcon />
          </div>
        </div>

        
        <div className="w-full flex flex-col items-center gap-4">
          <p className="text-primary font-semibold">{message}</p>
          <InputBox
            reference={titleRef}
            placeholder="Enter your Title"
            type="text"
            required={true}
          />
          <InputBox
            reference={linkRef}
            placeholder="Enter Link"
            type="text"
            required={true}
          />
          <div>
            <label htmlFor="type">Type:</label>
            <select className="py-2 px-3 mx-2 rounded-lg" name="type" id="type">
              <option value="youtube">Youtube</option>
              <option value="tweet">Tweet</option>
            </select>
          </div>
          <Button
            text="Submit"
            variant="primary"
            size="md"
            OnClickFn={onSubmit}
          />
          
        </div>
      </div>
    </div>
  );
};

export default Modal;
