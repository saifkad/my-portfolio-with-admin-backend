import Image from 'next/image';

export default function About({ userData }) {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-800/50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">
          About <span className="text-primary-600 dark:text-primary-400">Me</span>
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition duration-500"></div>
            <Image
              src={userData?.backgroundImage || '/workspace.jpg'}
              alt="Workspace"
              width={600}
              height={400}
              className="relative rounded-2xl w-full h-[400px] object-cover shadow-2xl border border-gray-200 dark:border-gray-700"
            />
          </div>

          <div className="md:w-1/2 space-y-6">
            <h3 className="text-3xl font-semibold text-gray-800 dark:text-white">
              {userData?.title || 'Full Stack Developer with 5+ years of experience'}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
              {userData?.bio || `I'm a passionate developer who loves creating beautiful and functional web applications. 
              With expertise in modern JavaScript frameworks and cloud technologies, I help businesses 
              bring their ideas to life through code.`}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <span className="block text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">50+</span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Projects Completed</span>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <span className="block text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">3+</span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Years Experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}