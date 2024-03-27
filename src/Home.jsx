import React, { useState } from "react";
import { Button, Modal } from "antd";
import { IoIosDocument } from "react-icons/io";
function Home() {
  // const [resumes, setResumes] = useState([
  //   {
  //     name: "Akshat_resume.pdf",
  //     id: 1,
  //     desc: "Akshat Jain 8356815872 | akshatjain8356@gmail.com Mumbai, India 4000092 SKILLS Computer Skills:- flutter People Skills:-good communication skills Developer,dart,python,c EDUCATION AND TRAINING 12th Science Education, M.J.(Mandakini Jaywant) Junior College of Science, Old M.H.B Colony, Gorai Road,Borivali(west),Mumbai February 2021 10th Pawar Public School, Sal Baba Nagar,kandivall(west) May 2019 Bachelor of Engineering Computer Engineering, Thadomal Shahani Engineering College, Linking Road, Bandra(West),mumbai-400050 PROJECTS Xylophone: app for a musical instrument A mobile application where you can play xylophone having different notes. -https://github.com/Akshat949/flutter_xylophone.git used:-dart,flutter packages Climaa: app to show the live weather of the place you are present at A mobile application where user can see the current weather condition of the place they are at link:- https://github.com/Akshat949/flutter_climaa.gi used:-dart,flutterpackages,ap",
  //   },
  //   {
  //     name: "Harshit_resume.pdf",
  //     id: 2,
  //     desc: "HARSHIT JAIN Student PROFILE EDUCATION I consider my self a Passed 10th ICSE with 92.33% responsible and orderly Passed 12th HSC with 94.83% person. Currently studying at Thadomal Shahani I am looking foward for Engineering College (B.E. Computer Engineering). my first work CGPI:8.64 experience. LANGUAGES Python Javascript CONTACT ME C +91 9004701028 FRAMEWORK harshitjain4262@gmail.com Express.js Mumbai, Django Maharashtra PROJECTS Mouse controls using hand gestures (Python) A website to fetch and display live stocks/currency data.",
  //   },
  // ]);
  const [resumes,setResumes] = useState([])
  const [bestSearch, setBestSearch] = useState([]);
  const [input, setInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const getBackgroundColor = () => {
    const colors = ['#FF8A65', '#FFB74D', '#FFD54F', '#FFF176', '#DCE775', '#69F0AE', '#00E676', '#4DB6AC', '#80DEEA', '#4FC3F7'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const deleteResume = (id) => {
    const updatedResumes = resumes.filter(resume => resume.id !== id);
    setResumes(updatedResumes);
  };
  
  const getMatchScoreColor = (matchScore) => {
    if (matchScore >= 80) {
      return 'green';
    } else if (matchScore >= 60) {
      return '#CCCC00';
    } else {
      return 'red';
    }
  };
  const resumeText = resumes
    .map((resume) => `name:${resume.name},description:${resume.desc}`)
    .join("\n\n");
  const handleGenerate = async () => {
    console.log("pressed");
    const response = await fetch("https://api.edenai.run/v2/text/generation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZWY4ZmI2YjctMzczOC00NWNjLWJhNjUtYjYxZDkxMGRkZDIzIiwidHlwZSI6ImFwaV90b2tlbiJ9.7_2wj3ZqUpcUfxXJHg5viceJPYmVWHmprqEvxByLBEw",
      },
      body: JSON.stringify({
        providers: "openai",
        text: `Generate a rank of resumes that has most keyword for ${input} and best suited with with keywords ${input}, and resumes are'${resumeText}'. The output should be in a well-structured JSON format.With only keywords present in description should be in skills. Here's an example of the expected output:
        [
          {
            "name": "Name of the person in resume",
            "skills": ["React","futter",etc"] // only add skills matching the input and in description,
            "matchScore":"" // generate a matchscore integer between 0-100 , the score depends upon how much resumes description of a particular person matches with keywords of input
          },
          {
            "name": "Name of the person in resume",
            "skills": ["python","django",etc] // only add skills matching the input and in description,
            "matchScore":""
          }
        ]
        
        Give the output according to the rank(Most skills match algorithm first) the best resume according to the keywords '${input}' with the main topic (resume name) and relevant skills from the desc .`,
        temperature: 0.2,
        max_tokens: 500,
        fallback_providers: "",
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data.openai.generated_text);
    const parsedData = JSON.parse(data.openai.generated_text);
    setIsModalOpen(true);
    setBestSearch(parsedData);
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload_photo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to recognize person");
      }

      const originalFileName = file.name;
      const fileExists = resumes.some(
        (resume) => resume.name === originalFileName
      );
      const data = await response.json();
      if (!fileExists) {
        const newResumes = [
          ...resumes,
          { name: originalFileName, id: resumes.length + 1, desc: data.data },
        ];
        setResumes(newResumes);
      }

      console.log(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <header className="p-4">
          <div className="flex items-center space-x-4 justify-between">
            <a className="flex items-center space-x-2" href="#">
            <IoIosDocument className="text-blue-500" size={28} />
              <span className="text-lg font-bold text-blue-500" style={{fontSize:"26px"}}>AI Resume Parser</span>
            </a>
            <label
              htmlFor="upload"
              className="hover:bg-white hover:text-blue-500 bg-blue-500 text-white inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
            >
              Upload Resume
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleImageUpload(event.target.files[0])}
              id="upload"
              className="hidden"
            />
          </div>
        </header>

        <main className="flex-1 flex flex-col p-4 gap-4 md:p-6">
          <div className="border rounded-lg p-4 grid gap-4 bg-gray-100">
            <div className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-gray-500 dark:text-gray-400"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              <h1 className="text-lg font-semibold tracking-wider">
                Search for Best Resumes
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter keywords to search for best resumes..."
                type="search"
              />
              <button
                onClick={handleGenerate}
                className="bg-slate-700 hover:bg-slate-500 text-white inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3"
              >
                Search
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {resumes &&
              resumes.map((resume) => (
                <div className="border rounded-lg p-4 grid gap-4 bg-gray-100">
                  <div className="flex items-center gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-6 h-6 text-gray-500 dark:text-gray-400"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <h1 className="text-lg font-semibold tracking-wider">
                      {resume.name}
                    </h1>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
                      View
                    </button>
                    <button onClick={() => deleteResume(resume.id)} className="text-red-400 hover:text-red-400 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </main>
      </div>
      <Modal
        title="Best Results"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {bestSearch && (
          <div>
            {bestSearch.map((resume,id) => (
              <div key={resume.name} style={{ marginBottom: "20px" }}>
                <div style={{ fontWeight: "bold",fontSize:"20px"}}>{id+1}. {resume.name}</div>
                <div>
                  {resume.skills.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        display: "inline-block",
                        backgroundColor: getBackgroundColor(resume.matchScore),
                        padding: "5px 10px",
                        borderRadius: "20px",
                        marginRight: "10px",
                        marginBottom: "10px",
                        color:"black",
                        margin:"15px 4px",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div>
                  <span style={{ fontWeight: "bold",fontSize:"17px" }}>Match Score: </span>
                  <span
                    style={{ color: getMatchScoreColor(resume.matchScore), fontWeight: "bold",fontSize:"17px" }}
                  >
                    {resume.matchScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
}

export default Home;
