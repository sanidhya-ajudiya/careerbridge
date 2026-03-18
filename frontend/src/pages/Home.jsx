import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaSearch, FaUserTie, FaRocket, FaMapMarkerAlt, FaDollarSign, FaBuilding } from 'react-icons/fa';
import api from '../utils/api';
import { motion } from 'framer-motion';

const Home = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const stagger = {
        visible: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestJobs = async () => {
            try {
                const { data } = await api.get('/jobs?limit=6');
                setJobs(data);
            } catch (error) {
                console.error('Error fetching latest jobs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestJobs();
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-400/20 rounded-full blur-[120px] animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-secondary-400/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] bg-primary-300/20 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
            </div>

            {/* Hero Section */}
            <div className="relative pt-32 pb-24 lg:pt-48 lg:pb-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="text-center"
                    >
                        <motion.h1
                            variants={fadeIn}
                            className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-slate-900 leading-[0.9]"
                        >
                            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">Dream Job</span> Today
                        </motion.h1>

                        <motion.p
                            variants={fadeIn}
                            className="text-xl md:text-2xl mb-12 text-slate-600 max-w-3xl mx-auto font-medium"
                        >
                            Connect with 500+ top employers and discover opportunities that actually match your unique skills.
                        </motion.p>

                        <motion.div
                            variants={fadeIn}
                            className="flex flex-col sm:flex-row justify-center items-center gap-4"
                        >
                            <Link to="/register" className="btn-primary group flex items-center gap-2 text-lg">
                                Get Started <FaRocket className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Link>
                            <Link to="/login" className="px-8 py-3 rounded-xl font-semibold border-2 border-slate-200 text-slate-700 hover:bg-slate-50 transition-all text-lg">
                                Sign In
                            </Link>
                        </motion.div>

                        {/* Floating Stats or Trust Badges */}
                        <motion.div
                            variants={fadeIn}
                            className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16 grayscale opacity-60"
                        >
                            <div className="text-2xl font-bold italic">Microsoft</div>
                            <div className="text-2xl font-bold italic">Google</div>
                            <div className="text-2xl font-bold italic">Amazon</div>
                            <div className="text-2xl font-bold italic">Meta</div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Why Choose JobPortal?</h2>
                    <p className="text-xl text-slate-500">Industry-leading features to accelerate your career</p>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={stagger}
                    className="grid md:grid-cols-3 gap-10"
                >
                    <motion.div variants={fadeIn} className="card group">
                        <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 shadow-inner">
                            <FaSearch className="text-primary-600 group-hover:text-white text-2xl transition-colors" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Easy Job Search</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Search and filter thousands of jobs by location, salary, and job type with our advanced algorithm.
                        </p>
                    </motion.div>

                    <motion.div variants={fadeIn} className="card group">
                        <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-secondary-600 group-hover:text-white transition-all duration-500 shadow-inner">
                            <FaUserTie className="text-secondary-600 group-hover:text-white text-2xl transition-colors" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Top Employers</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Connect directly with verified leading companies looking for talented professionals like you.
                        </p>
                    </motion.div>

                    <motion.div variants={fadeIn} className="card group">
                        <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 shadow-inner">
                            <FaRocket className="text-primary-600 group-hover:text-white text-2xl transition-colors" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Quick Apply</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Apply to multiple jobs with a single click and track your applications in real-time.
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Latest Jobs Section */}
            <div className="bg-slate-50 py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Latest Job Openings</h2>
                            <p className="text-xl text-slate-500">Discover your next career move from our freshest listings</p>
                        </div>
                        <Link to="/jobseeker/jobs" className="btn-secondary group">
                            Browse All Jobs <FaRocket className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {jobs.map((job) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white rounded-3xl p-8 border border-slate-100 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 group flex flex-col"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                                            <FaBriefcase className="text-2xl text-primary-600" />
                                        </div>
                                        <span className="px-4 py-1.5 rounded-full bg-secondary-50 text-secondary-700 text-sm font-bold">
                                            {job.jobType}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2 truncate">{job.title}</h3>
                                    <div className="flex items-center gap-2 text-slate-500 mb-6 font-medium">
                                        <FaBuilding className="text-slate-400" />
                                        <span className="truncate">{job.employer?.companyName || job.employer?.name}</span>
                                    </div>
                                    <div className="space-y-3 mb-8">
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <FaMapMarkerAlt className="text-primary-500" />
                                            <span>{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600 font-bold">
                                            <FaDollarSign className="text-secondary-500" />
                                            <span>₹{job.salaryMin.toLocaleString()} - ₹{job.salaryMax.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="mt-auto">
                                        <Link 
                                            to={`/jobseeker/jobs/${job.id}`} 
                                            className="w-full py-4 px-6 rounded-2xl border-2 border-slate-100 text-slate-900 font-bold text-center block hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="glass-dark rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden"
                >
                    {/* Inner Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-primary-500/20 blur-[100px]"></div>

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Ready to Get Started?</h2>
                        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                            Join thousands of job seekers and employers who are already growing with our platform.
                        </p>
                        <Link to="/register" className="btn-primary text-lg px-12 py-5 inline-block">
                            Create Free Account
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;
