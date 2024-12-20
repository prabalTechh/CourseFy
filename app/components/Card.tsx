import { useState, useEffect } from 'react';
import Delete from '../icons/Delete';

// Define a TypeScript interface for course data
interface Course {
  courseId: number; // Ensure this matches the actual data structure
  title: string;
  imageLink: string;
}

const Card = () => {
  const [courses, setCourses] = useState<Course[]>([]); // Typed courses array
  const [error, setError] = useState<string | null>(null); // Error as a string or null

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchCourses = async () => {
      try {
        // Retrieve token from localStorage or other storage
        const response = await fetch('/api/users/courses', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: Course[] = await response.json(); // Explicitly typing the response
        setCourses(data);
        setError(null); // Reset error if the fetch is successful
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
        console.error('Error fetching courses:', error);
      }
    };

    // Fetch data immediately on mount
    fetchCourses();

    // Set up polling every 10 seconds
    intervalId = setInterval(() => {
      fetchCourses();
    }, 5 * 1000);

    // Cleanup function to clear interval
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleBuyNow = async (courseId: number) => {
    try {
      const token = localStorage.getItem('Authorization');

      if (!token) {
        setError('Authorization token not found');
        return;
      }

      const response = await fetch(`/api/users/buy-course`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });

      if (response.ok) {
        alert('Course successfully purchased!');
      } else {
        throw new Error('Failed to purchase course');
      }
    } catch (error) {
      console.error('Error purchasing course:', error);
      setError('An error occurred while purchasing the course.');
    }
  };

  // Handle delete
  const handleDelete = async (courseId: number) => {
    try {
      const token = localStorage.getItem('Authorization');

      if (!token) {
        setError('Authorization token not found');
        return;
      }

      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Filter out the deleted course from the local state
        setCourses(courses.filter(course => course.courseId !== courseId));
      } else {
        throw new Error('Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      setError('An error occurred while deleting the course.');
    }
  };

  return (
    <div className="flex flex-wrap justify-center p-4">
      {error && (
        <p className="text-red-500 text-center">Failed to load courses: {error}</p>
      )}
      {courses.length === 0 && !error && (
        <p className="text-gray-600 text-center">No courses available.</p>
      )}
      {courses.map((course) => (
        <div
          key={course.courseId}
          className="flex rounded-xl bg-white/15 flex-col items-center justify-center w-64 px-4 py-2 border shadow-xl shadow-gray-300 border-gray-500/25 mx-2 my-2"
        >
          <div className="flex justify-end p-2 h-full w-full">
            <button onClick={() => handleDelete(course.courseId)}>
              <Delete />
            </button>
          </div>
          <div className="w-full h-full">
            <img
              src={course.imageLink || 'https://via.placeholder.com/200'} // Fallback image
              alt={course.title || 'Course image'}
              className=""
            />
          </div>

          <hr className="w-full mt-3" />
          <div className="flex flex-col gap-2 w-52 py-2 px-6">
            <h1 className="text-gray-600">{course.title || 'Untitled Course'}</h1>
            <div className="flex gap-2 items-center py-2">
              <button className="px-2 py-2 text-xs bg-black text-center text-gray-200 rounded-lg">
                View Course
              </button>
              <button
                className="px-2 py-2 text-xs bg-black text-gray-200 text-center rounded-lg"
                onClick={() => handleBuyNow(course.courseId)} // Pass courseId here
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
