import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseBox from "../../CommonComponents/CourseBox";
import NotFound from "../../CommonComponents/NotFound";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';


export default function BrowseCourses({ user }) {
    const [coursesData, setCoursesData] = useState([]);
    const [courses, setCourses] = useState([]);
    const [category, setCategory] = useState("myInterested");
    const [sort, setSort] = useState("name");
    const [searchText, setSearchText] = useState("");

    // console.log(user.interests)

    const allInterests = [
        "Competitive Programming",
        "Web/App Designing",
        "Gaming",
        "Photography",
        "Debating",
        "Singing",
        "Writing",
        "Art & Craft",
        "Graphics Designing",
    ];


    useEffect(() => {
        axios
            .get("http://localhost:3000/student/course")
            .then((res) => {
                console.log("Success");
                const coursesData = res.data?.courses || [];

                let filteredCoursesData = coursesData.filter(course => user.interests.includes(course.course_category));
                filteredCoursesData.sort((a, b) => a.course_name.localeCompare(b.course_name));
                setCoursesData(coursesData);
                setCourses(filteredCoursesData);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        let filteredCoursesData;
        let sortValue = name == "sort" ? value : sort;
        let categoryValue = name == "category" ? value : category;
        let searchTextValue = name == "search" ? value : searchText;

        if (categoryValue == "all") {
            setCategory("all");
            filteredCoursesData = coursesData.filter(course => allInterests.includes(course.course_category));
        } else if (categoryValue == "myInterested") {
            filteredCoursesData = coursesData.filter(course => user.interests.includes(course.course_category));
            setCategory("myInterested");
        } else {
            filteredCoursesData = coursesData.filter(course => course.course_category == categoryValue);
            setCategory(categoryValue);
        }

        filteredCoursesData = filteredCoursesData.filter(course => course.course_name.toLowerCase().includes(searchTextValue.toLowerCase()));

        if (sortValue == "name") {
            setSort("name")
            filteredCoursesData.sort((a, b) => a.course_name.localeCompare(b.course_name));
        }
        else {
            setSort("member")
            filteredCoursesData.sort((a, b) => b.total_member - a.total_member);
        }

        setCourses(filteredCoursesData);
    }

    return (
        <div className="tabContent">
            <div className="filterBox filterBoxCommunity">
                <div className="searchBox" >
                    <MaterialSymbol className="icon" size={22} icon="search" />
                    <input name="search" onChange={handleInputChange} placeholder="Search by name..." />
                </div>
                <div className="filters">
                    <div className="filterName">Sort By</div>
                    <div className="filter">
                        <MaterialSymbol className="icon" size={22} icon="tune" />
                        <select name="sort" onChange={handleInputChange}>
                            <option value="name">Name</option>
                            <option value="member">Members</option>
                        </select>
                    </div>
                    <div className="filterName">Category</div>
                    <div className="filter">
                        <InterestIcon category={category} />
                        <select name="category" onChange={handleInputChange}>
                            <option
                                value="myInterested"
                            >
                                My Interested
                            </option>
                            {allInterests.map((interest) => (
                                <option value={interest}>{interest}</option>
                            ))}
                            <option value="all">
                                All
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            {courses.length > 0 ?
                courses.map(function (course) {
                    return (
                        <CourseBox
                            key={course.course_id}
                            id={course.course_id}
                            name={course.course_name}
                            mentorPicture={course.mentor_picture}
                            mentorId={course.mentor_id}
                            category={course.course_category}
                            description={course.course_description}
                            mentorName={course.course_mentor_name}
                            isJoined={course.is_joined}
                            totalMember={course.total_member}
                            user={user}
                        />
                    )
                })
                :
                <NotFound message="No Course Found" />
            }
        </div>
    );
}


function InterestIcon(data) {
    //   console.log();
    data = data.category;
    if (data == "Competitive Programming") {
        return <MaterialSymbol className="icon" size={22} icon="code" />;
    } else if (data == "Singing") {
        return <MaterialSymbol className="icon" size={22} icon="queue_music" />;
    } else if (data == "Graphics Designing") {
        return <MaterialSymbol className="icon" size={22} icon="polyline" />;
    } else if (data == "Photography") {
        return <MaterialSymbol className="icon" size={22} icon="photo_camera" />;
    } else if (data == "Web/App Designing") {
        return <MaterialSymbol className="icon" size={22} icon="web" />;
    } else if (data == "Writing") {
        return <MaterialSymbol className="icon" size={22} icon="edit_note" />;
    } else if (data == "Art & Craft") {
        return <MaterialSymbol className="icon" size={22} icon="draw" />;
    } else if (data == "Debating") {
        return <MaterialSymbol className="icon" size={22} icon="communication" />;
    } else if (data == "Gaming") {
        return <MaterialSymbol className="icon" size={22} icon="sports_esports" />;
    } else {
        return <MaterialSymbol className="icon" size={22} icon="interests" />;
    }
}