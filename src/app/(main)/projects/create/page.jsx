"use client";

import { createClient } from "@/utils/supabase/client";

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { FaXmark } from "react-icons/fa6";
import { Checkbox } from "@nextui-org/react";

import availableTagsJson from "@/utils/data/availableTags.json";
import styles from "@/app/ui/styles.module.css";

import CharacterCounter from "@/app/ui/components/CharacterCounter"; // Adjust the import path accordingly
import { replaceSpaces } from "@/utils/importantfunctions2";
import { BiChevronDown } from "react-icons/bi";
import { toast } from "sonner";

// import { createProjectMessageTable } from "@/utils/processes/messageFunctions";
import { addProjectMember } from "@/utils/processes/projectFunctions";

export default function CreateProject() {
  const router = useRouter();
  const supabase = createClient();

  const filesEntry = useRef(null);
  const avatarEntry = useRef(null);
  const [files, setFiles] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [chosenTags, setChosenTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [maxTagError, setMaxTagError] = useState("");
  const [isPayNone, setIsPayNone] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [about, setAbout] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [budget, setBudget] = useState("");
  const [budgetOrNone, setBudgetOrNone] = useState("budget");

  const [selectedPayType, setSelectedPayType] = useState("Hr");

  const [creatingProject, setCreatingProject] = useState(false);

  // const [projectsInfo, setProjectsInfo] = useState('')

  const [error, setError] = useState({
    projectName: "",
    about: "",
    lookingFor: "",
    budget: "",
    coverPage: "",
    tags: "",
  });

  let validationErrors = {
    projectName: "",
    about: "",
    lookingFor: "",
    budget: "",
    coverPage: "",
    tags: "",
  };

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    setAvailableTags(availableTagsJson.tags);
    return () => {
      setFiles(null);
      setAvatar(null);
    };
  }, []);

  function newFileEntry() {
    const selectedFile = filesEntry.current.files[0];
    setFiles(selectedFile);
    // console.log(files);
  }

  function newAvatarEntry() {
    const selecteddFile = avatarEntry.current.files[0];
    setAvatar(selecteddFile);
    // console.log(avatar);
  }

  function toggleTag(tag) {
    if (chosenTags.includes(tag)) {
      setChosenTags(chosenTags.filter((t) => t !== tag));
    } else if (chosenTags.length < 10) {
      setChosenTags([...chosenTags, tag]);
      setMaxTagError("");
    } else {
      setMaxTagError("Max tags reached");
    }
  }

  const [tagsVisibility, setTagsVisibility] = useState(false);
  const displayTags = () => {
    setTagsVisibility(!tagsVisibility);
  };

  const addRole = () => {
    setRoles([...roles, { title: "", description: "" }]);
  };

  const handleRoleChange = (index, field, value) => {
    const newRoles = [...roles];
    newRoles[index][field] = value;
    setRoles(newRoles);
  };

  const createProject = async () => {
    const formData = new FormData();
    formData.append("avatar", avatar);
    formData.append("thumbnail", files);
    formData.append("project_name", projectName);
    formData.append("about", about);
    formData.append("looking_for", JSON.stringify(roles));
    formData.append("tags", JSON.stringify(chosenTags));
    formData.append("budget", budgetOrNone === "budget" ? budget : "0");
    const hasConsecutiveCharacters = (text) => /(.)\1{5,}/.test(text); // checks for consecutive characters.

    const { data: projectsData, error } = await supabase.from("projects").select("*");
    // console.log('Logging projects data  ' + projectsData)
    projectsData.map((project) => {
      if (project.name === projectName) {
        validationErrors.projectName = "Another project has this name. Please choose another name.";
        toast.error("Another project has this name. Please choose another name.");
      }
    });

    if (chosenTags.length < 3) {
      validationErrors.tags = "Please select at least 3 tags";
      toast.error("Please select at least 3 tags");
    }

    if (projectName === "") {
      validationErrors.projectName = "Please fill in this field";
      toast.error("Please enter a project name.");
    } else if (projectName.length < 5) {
      validationErrors.projectName = "Please enter at least 5 characters";
      toast.error("Your project name must be at least 5 characters long.");
    } else if (hasConsecutiveCharacters(projectName)) {
      validationErrors.projectName = "Please avoid consecutive characters";
      toast.error("Your project name cannot have consecutive characters.");
    } else if (projectName === projectsData.name) {
      validationErrors.projectName = "Another project has this name. Please choose another name.";
      toast.error("Another project has this name. Please choose another name.");
    }

    if (about === "") {
      validationErrors.about = "Please fill in this field";
      toast.error("Please enter a project description.");
    } else if (about.length < 100) {
      validationErrors.about = "Please enter at least 100 characters";
      toast.error("Your project description must be at least 100 characters long.");
    }

    // if (lookingFor === "") {
    //   validationErrors.lookingFor = "Please fill in this field";
    // } else if (lookingFor.length < 100) {
    //   validationErrors.lookingFor = "Please enter at least 100 characters";
    // }

    roles.map((role, index) => {
      if (role.title === "") {
        validationErrors.lookingFor = "Please fill in this field";
        toast.error("Please add a title for each role.");
      } else if (role.title.length < 5) {
        validationErrors.lookingFor = "Please enter at least 5 characters";
        toast.error("Please add a title for each role.");
      }

      if (role.description === "") {
        validationErrors.lookingFor = "Please fill in this field";
        toast.error("Please add a description for each role.");
      } else if (role.description.length < 20) {
        validationErrors.lookingFor = "Please enter at least 20 characters";
        toast.error("Please add a description for each role.");
      }
    });

    if (budgetOrNone === "budget" && budget === "") {
      validationErrors.budget = "Please fill in this field";
      toast.error("Please enter a budget for your project.");
    } else if (budgetOrNone === "budget" && (budget < 5 || budget > 5000)) {
      validationErrors.budget = "Please enter a valid budget between $5 and $5000";
      toast.error("Please enter a valid budget for your project.");
    }

    if (files === null) {
      validationErrors.coverPage = "Please upload a cover page";
      toast.error("Please upload a cover image for your project.");
    }

    setError(validationErrors);

    if (Object.values(validationErrors).every((error) => error === "")) {
      createProjectFinal();
    }
  };

  const createProjectFinal = async () => {
    setCreatingProject(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    try {
      const { error: createProjectError } = await supabase
        .from("projects")
        .insert([
          {
            name: replaceSpaces(projectName),
            description: about,
            tags: chosenTags,
            looking_for: roles,
            budget: budgetOrNone === "budget" ? budget : "0",
            thumbnail_url: "thumbnail.png",
            avatar_url: "avatar.png",
            owner: user?.id,
            created_at: new Date(),
          },
        ])
        .select();

      if (createProjectError) {
        console.log(createProjectError);
        setCreatingProject(false);
        throw createProjectError;
      }
      console.log("Create Questionaire reached");
      await createQuestionaire();

      let filePath = `${projectName}/thumbnail.png`;
      let filePath2 = `${projectName}/avatar.png`;

      const { error } = await supabase.storage.from("projects").upload(filePath, files);
      const { error: error2 } = await supabase.storage.from("projects").upload(filePath2, avatar);

      if (error) {
        setCreatingProject(false);
        throw error;
      }

      if (error2) {
        setCreatingProject(false);
        throw error2;
      }
    } catch (error) {
      console.error(error);
    }
    await addProjectMember(projectName, null, user?.id, "owner");

    router.push(`/project/${projectName}`);
    // await createProjectMessageTable(projectName + "_project_groupchat", projectName);
  };

  const createQuestionaire = async () => {
    console.log("Create Questionaire Function called.");
    try {
      const { error: createProjectQuestionaireError } = await supabase
        .from("project_questionaire")
        .insert([
          {
            created_at: new Date(),
            questions: ["", "", ""],
            msg_from_owner: "",
            project_name: projectName,
          },
        ])
        .select();

      if (createProjectQuestionaireError) {
        console.log("Project Questionaire not created.");
        setCreatingProject(false);
        console.log("Error in createProjectQuestionaire:", createProjectQuestionaireError.message);
        throw createProjectQuestionaireError;
      } else {
        console.log("Project Questionaire created.");
      }
      console.log("Project Questionaire outline created.");
    } catch (error) {
      console.error("Error in createQuestionaire:", error);
    }
  };

  return (
    <div className="w-full p-8">
      <div className="flex w-full flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-white">Create Your Project</h1>

        {/* File upload section */}
        <div className="mt-20 flex flex-col gap-8 text-white">
          <div className="flex flex-col gap-3">
            <h1 className="text-xl font-bold">Add Project Avatar</h1>
            <div className="relative size-24 p-1">
              <label className="group absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-blackLight duration-200 hover:bg-blackLight/75">
                <svg
                  className="size-6 rounded-full stroke-white/75 duration-200 group-hover:stroke-white"
                  width="26"
                  height="26"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.173 10.4274L25.573 15.8274M6.6731 29.3274L13.2221 28.0078C13.5697 27.9378 13.889 27.7666 14.1397 27.5157L28.8002 12.8472C29.5031 12.1439 29.5026 11.0039 28.7991 10.3012L25.6935 7.1991C24.9903 6.49669 23.8509 6.49717 23.1483 7.20016L8.48624 21.8702C8.23602 22.1206 8.06517 22.4392 7.99505 22.7861L6.6731 29.3274Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input name="avatar" type="file" ref={avatarEntry} className="hidden" onChange={newAvatarEntry} />
              </label>

              {/* Uploaded image */}
              {avatar && typeof avatar === "object" && (
                <img
                  src={URL.createObjectURL(avatar)}
                  alt="Uploaded Cover Page"
                  className="absolute inset-0 z-10 h-full w-full rounded-full object-cover blur-[2px] transition-all duration-150 ease-in-out hover:blur-none"
                  onLoad={() => URL.revokeObjectURL(URL.createObjectURL(avatar))}
                />
              )}
            </div>

            {error.coverPage && <label className="ml-2 text-sm font-medium text-red-500">{error.coverPage}</label>}
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-xl font-bold">Add Thumbnail</h1>
            <div className="relative h-[16rem] w-[35rem]">
              <label className="group absolute inset-0 flex cursor-pointer items-center justify-center rounded-2xl bg-blackLight duration-200 hover:bg-blackLight/75">
                <svg
                  className="size-6 rounded-full stroke-white duration-200 group-hover:stroke-white"
                  width="26"
                  height="26"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.173 10.4274L25.573 15.8274M6.6731 29.3274L13.2221 28.0078C13.5697 27.9378 13.889 27.7666 14.1397 27.5157L28.8002 12.8472C29.5031 12.1439 29.5026 11.0039 28.7991 10.3012L25.6935 7.1991C24.9903 6.49669 23.8509 6.49717 23.1483 7.20016L8.48624 21.8702C8.23602 22.1206 8.06517 22.4392 7.99505 22.7861L6.6731 29.3274Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input name="thumbnail" type="file" ref={filesEntry} className="hidden" onChange={newFileEntry} />
              </label>

              {/* Uploaded image */}
              {files && typeof files === "object" && (
                <img
                  src={URL.createObjectURL(files)}
                  alt="Uploaded Cover Page"
                  className="absolute inset-0 z-10 h-full w-full rounded-3xl object-cover blur-[2px] transition-all duration-150 ease-in-out hover:blur-none"
                  onLoad={() => URL.revokeObjectURL(URL.createObjectURL(files))}
                />
              )}
            </div>

            {error.coverPage && <label className="ml-2 text-sm font-medium text-red-500">{error.coverPage}</label>}
          </div>

          {/* Project details section */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-xl font-bold">Project Name</label>
                <label className="scale-90 text-white/75">
                  <CharacterCounter value={projectName} maxLength={20} />
                </label>
              </div>

              <input
                name="project_name"
                type="text"
                placeholder="Type Here"
                required
                className="h-10 w-[35rem] rounded-3xl border border-transparent bg-blackLight p-4 placeholder:text-white/50 focus:border-white/50 focus:outline-none"
                onChange={(e) => {
                  setProjectName(e.target.value);
                  setError({ ...error, projectName: "" });
                }}
                maxLength={20}
              />
              {error.projectName && <label className="ml-2 text-sm font-medium text-red-500">{error.projectName}</label>}
            </div>

            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xl font-bold">About</label>
                <label className="scale-90 text-white/75">
                  <CharacterCounter value={about} maxLength={150} />
                </label>
              </div>

              <input
                name="about"
                placeholder="Type Here"
                className="h-10 w-[35rem] rounded-3xl border border-transparent bg-blackLight p-4 placeholder:text-white/50 focus:border-white/50 focus:outline-none"
                onChange={(e) => {
                  setAbout(e.target.value);
                  setError({ ...error, about: "" });
                }}
                maxLength={150}
              />
              {error.about && <label className="ml-2 text-sm font-medium text-red-500">{error.about}</label>}
            </div>

            {/* Tag selection section */}
            <div className="mt-5 gap-5">
              <div className="mb-2 flex gap-2">
                <h1 className="text-xl font-bold">Add Tags</h1>

                <div className="flex items-end gap-2">
                  <p className="text-xs text-white/75">3 minimum | {chosenTags.length}/10</p>
                </div>
              </div>

              <button onClick={displayTags} className="flex items-center gap-2 rounded-full bg-blackLight p-2 px-4 hover:bg-blackLight/75">
                <svg className="stroke-white" width="24" height="24" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5 7L17.5 28M28 17.5L7 17.5" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <h1 className="text-base font-semibold">Add Tag</h1>
              </button>

              <div className="mt-3 flex w-[35rem] flex-wrap gap-2">
                {chosenTags.map((tag, tagIndex) => (
                  <div key={tagIndex} className="flex gap-2 rounded-full bg-blackLight px-3 py-1">
                    <p className="text-sm font-medium">{tag}</p>
                    <button onClick={() => toggleTag(tag)} className="ml-auto">
                      <FaXmark className="text-sm text-white" />
                    </button>
                  </div>
                ))}
              </div>
              {error.tags && <label className="ml-2 text-sm font-medium text-red-500">{error.tags}</label>}
            </div>

            {/* Tags selection modal */}
            <div
              className={`${tagsVisibility ? "opacity-100 backdrop-blur-sm" : "pointer-events-none opacity-0 backdrop-blur-none"} fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center rounded-xl bg-[#00000050] duration-300`}
            >
              <div className={`h-4/5 w-1/2 overflow-hidden overflow-y-scroll rounded-3xl bg-blackLight p-6 ${styles.scroll}`}>
                <div className="flex w-full items-center">
                  <h1 className="text-xl font-bold">Choose Tags:</h1>
                  <h1 className="ml-2 mt-1 text-red-500">{maxTagError}</h1>
                  <FaXmark onClick={displayTags} className="ml-auto text-xl hover:cursor-pointer" />
                </div>

                <div className="mt-8 grid grid-flow-row grid-cols-4 gap-5">
                  {availableTags.map((tag, tagIndex) => (
                    <button
                      key={tagIndex}
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full px-4 py-2 text-sm ${chosenTags.includes(tag) ? "bg-primary text-white" : "bg-blackLighter text-white"}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="text-xl font-bold">Roles That You Are Looking For</h1>

              {roles.map((role, index) => (
                <div key={index} className="flex flex-col">
                  <label htmlFor={`${index} role name`} className="mb-1 text-base font-semibold text-white/75">
                    Role Name:
                  </label>
                  <input
                    id={`${index} role name`}
                    type="text"
                    value={role.title}
                    onChange={(e) => handleRoleChange(index, "title", e.target.value)}
                    className="h-10 w-[35rem] rounded-3xl border border-transparent bg-blackLight p-4 placeholder:text-white/50 focus:border-white/50 focus:outline-none"
                    maxLength={20}
                  />

                  <label htmlFor={`${index} role desc`} className="mb-1 mt-2 text-base font-semibold text-white/75">
                    Role Description:
                  </label>
                  <textarea
                    id={`${index} role desc`}
                    value={role.description}
                    onChange={(e) => handleRoleChange(index, "description", e.target.value)}
                    rows={5}
                    className="scrollbar-none w-full resize-none rounded-2xl bg-blackLight p-4 font-normal text-white placeholder:text-white/50 focus:border-none focus:border-white/50 focus:outline-none focus:ring-primary focus:ring-opacity-50"
                    maxLength={100}
                  />

                  {/* <div className="mt-2 flex justify-end gap-3">
                    <button className="button bg-blackLight">Cancel</button>
                    <button className="button bg-primary" onClick={``}>Done</button>
                  </div> */}
                </div>
              ))}
              <button
                onClick={addRole}
                className="flex w-[35rem] items-center justify-center gap-2 rounded-full bg-blackLight py-2 hover:bg-blackLight/75"
              >
                <svg className="stroke-white" width="24" height="24" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5 7L17.5 28M28 17.5L7 17.5" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <h1 className="text-base font-bold">Add Role</h1>
              </button>

              {error.lookingFor && <label className="ml-2 text-sm font-medium text-red-500">{error.lookingFor}</label>}
            </div>
          </div>

          {/* Budget section */}
          <div>
            <h1 className="mb-2 text-xl font-bold">Pay</h1>
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                <label
                  style={budgetOrNone === "none" ? { opacity: 0.4 } : {}}
                  htmlFor="budget"
                  className="flex w-[15rem] items-center rounded-full bg-blackLight pl-3 pr-1 duration-200"
                >
                  <div>$</div>
                  <input
                    id="budget"
                    type="number"
                    min={5}
                    max={5000}
                    name="budget"
                    placeholder="Type Here"
                    disabled={budgetOrNone === "none"}
                    className="mx-2 h-10 flex-1 bg-transparent focus:outline-none"
                    required
                    value={budgetOrNone === "none" ? "" : budget}
                    onChange={(e) => {
                      setBudget(e.target.value);
                      setError({ ...error, budget: "" });
                    }}
                  />

                  <Dropdown
                    classNames={{
                      base: ["bg-blackLight", "border", "border-white/20", "rounded-lg"],
                    }}
                  >
                    <DropdownTrigger>
                      <span className="flex gap-2 rounded-full bg-blackLighter px-2 py-1">
                        {selectedPayType}
                        <BiChevronDown className="text-xl" />
                      </span>
                    </DropdownTrigger>

                    <DropdownMenu
                      onAction={(key) => setSelectedPayType(key)}
                      itemClasses={{
                        base: ["text-white", "data-[hover=true]:bg-black", "data-[pressed=true]:bg-blackLighter"],
                      }}
                      aria-label="Static Actions"
                    >
                      <DropdownItem key="Hr">Hourly</DropdownItem>
                      <DropdownItem key="We">Weekly</DropdownItem>
                      <DropdownItem key="Mo">Monthly</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </label>

                <Checkbox
                  className="Checkbox"
                  classNames={{
                    wrapper: "bg-blackLight border-none outline-none",
                  }}
                  isSelected={budgetOrNone === "none"}
                  onValueChange={(isChecked) => {
                    setBudgetOrNone(isChecked ? "none" : "budget");
                    if (isChecked) {
                      setBudget("");
                    }
                  }}
                  radius="full"
                >
                  None
                </Checkbox>
              </div>
              {error.budget && <label className="ml-2 text-sm font-medium text-red-500">{error.budget}</label>}
            </div>
          </div>

          {/* Submit button */}
          <div className="flex w-full justify-center">
            <button
              onClick={createProject}
              className="button h-10 w-full bg-primary text-lg font-bold text-white transition-all duration-100 ease-in-out hover:bg-[#314bca]"
            >
              Submit
            </button>
          </div>
        </div>

        <div
          className={`${creatingProject ? "opacity-100 backdrop-blur-sm" : "pointer-events-none opacity-0 backdrop-blur-none"} fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center rounded-xl bg-[#00000050] transition-all duration-700`}
        >
          <div className="flex w-full items-center justify-center">
            <h1 className="text-5xl font-bold text-white">{projectName} is being created!</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
