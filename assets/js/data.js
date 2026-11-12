/* ============================================================
   PORTFOLIO CONTENT — edit this file to update the site.
   No build step: save, commit, push. GitHub Pages redeploys.
   ============================================================ */

window.PORTFOLIO = {
  profile: {
    name: "Stephen Glen",
    tagline: "Mechanical Engineering PhD Student",
    headline: "I build robots that sense, think and move.",
    intro: "Autonomous systems, embedded control and perception — from CAD to firmware to field testing.",
    // Paragraphs for the About section.
    about: [
      "I'm a robotics engineer who enjoys the whole stack: mechanical design, electronics, embedded firmware and high-level autonomy software.",
      "My favourite problems sit where hardware meets software — getting a real machine to behave the way the simulation said it would.",
      "Replace this text with your own story: what got you into robotics, what you're focused on now, and what you want to build next."
    ],
    // Optional: path to a photo, e.g. "assets/img/me.jpg". Leave "" for initials avatar.
    photo: "assets/img/Me.jpg",
    facts: [
      ["Based in", "San Antonio, TX"],
      ["Focus", "Autonomy · Controls · Embedded"],
      ["Status", "Open to opportunities"]
    ],
    email: "stephen.glen@my.utsa.edu",
    resume: "", // e.g. "assets/resume.pdf"
    social: [
      { label: "GitHub", icon: "github", url: "https://github.com/stephenglen2273" },
      { label: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/" }
    ]
  },

  /* ---------- Projects ----------
     image:   path in assets/img/projects/ (optional — a generated cover is used if empty)
     tags:    used for the filter buttons
     links:   any of { code, video, demo, paper, writeup }
     details: longer description shown in the pop-up (array of paragraphs)
     highlights: bullet list shown in the pop-up                     */
  projects: [
    {
      title: "Autonomous Mobile Robot",
      year: "2025",
      summary: "Differential-drive robot running ROS 2 Nav2 with LiDAR SLAM for indoor navigation.",
      tags: ["ROS 2", "SLAM", "Navigation"],
      image: "",
      featured: true,
      details: [
        "Designed and built a differential-drive platform with a 2D LiDAR, IMU and wheel encoders. Mapping with slam_toolbox, localisation with AMCL and path planning with Nav2.",
        "Replace with your own write-up: the problem, your approach, what went wrong, and results."
      ],
      highlights: [
        "Sensor fusion of IMU + wheel odometry with robot_localization (EKF)",
        "Custom URDF and Gazebo simulation for testing before hardware",
        "Reliable autonomous navigation across a multi-room map"
      ],
      links: { code: "https://github.com/", video: "" }
    },
    {
      title: "6-DOF Robotic Arm",
      year: "2024",
      summary: "3D-printed arm with inverse kinematics, trajectory planning and a MoveIt integration.",
      tags: ["Kinematics", "MoveIt", "Mechanical"],
      image: "",
      featured: true,
      details: [
        "Mechanical design in CAD, printed in PETG with cycloidal gearboxes on the base joints. Closed-form IK solver plus MoveIt for collision-aware planning."
      ],
      highlights: [
        "Closed-form inverse kinematics in Python and C++",
        "Pick-and-place using an overhead camera and ArUco markers",
        "Repeatability measured at ±1.5 mm"
      ],
      links: { code: "https://github.com/" }
    },
    {
      title: "Self-Balancing Robot",
      year: "2024",
      summary: "Two-wheel inverted pendulum stabilised with a cascaded PID / LQR controller on an STM32.",
      tags: ["Controls", "Embedded"],
      image: "",
      details: [
        "Modelled the system dynamics, designed an LQR controller in MATLAB and ported it to bare-metal C on an STM32 running at 1 kHz."
      ],
      highlights: [
        "Complementary filter for tilt estimation",
        "LQR vs PID comparison with logged step responses",
        "Bluetooth teleoperation"
      ],
      links: { code: "https://github.com/" }
    },
    {
      title: "Vision-Based Object Tracking",
      year: "2023",
      summary: "Real-time object detection and tracking on a Jetson for a pan-tilt camera turret.",
      tags: ["Perception", "Embedded"],
      image: "",
      details: [
        "YOLO detector running with TensorRT on a Jetson Orin Nano, feeding a Kalman-filter tracker and a PID pan-tilt controller."
      ],
      highlights: [
        "30+ FPS inference with TensorRT",
        "Kalman filter for smooth target prediction"
      ],
      links: { code: "https://github.com/" }
    }
  ],

  /* ---------- Skills ---------- */
  skills: [
    { group: "Software", items: ["Python", "C / C++", "ROS / ROS 2", "Linux", "Git"] },
    { group: "Autonomy & Perception", items: ["SLAM", "Nav2", "OpenCV", "PyTorch", "Sensor fusion"] },
    { group: "Controls", items: ["PID", "LQR / MPC", "Kinematics", "MATLAB / Simulink"] },
    { group: "Hardware", items: ["STM32 / Arduino", "Raspberry Pi / Jetson", "PCB design", "Motor drivers"] },
    { group: "Mechanical", items: ["SolidWorks / Fusion 360", "3D printing", "Machining", "GD&T"] },
    { group: "Simulation", items: ["Gazebo", "Isaac Sim", "URDF / Xacro", "MoveIt"] }
  ],

  /* ---------- Experience & education (newest first) ---------- */
  timeline: [
    {
      when: "2024 — Present",
      title: "Robotics Engineer",
      org: "Company Name",
      text: "What you worked on and the impact it had."
    },
    {
      when: "2023",
      title: "Robotics Intern",
      org: "Company or Lab",
      text: "Short description of the internship."
    },
    {
      when: "2019 — 2023",
      title: "B.S. Mechanical / Electrical / Robotics Engineering",
      org: "University Name",
      text: "Relevant coursework, robotics club, competitions."
    }
  ]
};
