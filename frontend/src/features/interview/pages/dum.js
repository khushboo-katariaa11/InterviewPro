import React, { useState, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useParams } from 'react-router'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions' },
    { id: 'behavioral', label: 'Behavioral Questions' },
    { id: 'roadmap', label: 'Road Map' },
]

// Question Card
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)

    return (
        <div>
            <div onClick={() => setOpen(!open)}>
                <span>Q{index + 1}</span>
                <p>{item.question}</p>
            </div>

            {open && (
                <div>
                    <div>
                        <span>Intention</span>
                        <p>{item.intention}</p>
                    </div>

                    <div>
                        <span>Model Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

// Roadmap Day
const RoadMapDay = ({ day }) => (
    <div>
        <div>
            <span>Day {day.day}</span>
            <h3>{day.focus}</h3>
        </div>

        <ul>
            {day.tasks.map((task, i) => (
                <li key={i}>{task}</li>
            ))}
        </ul>
    </div>
)

// Main Component
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')

    const { report, getReportById, loading, getResumePdf } = useInterview()

    const { interviewId } = useParams()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    if (loading || !report) {
        return (
            <main style={{ display: 'flex', gap: '1rem', padding: '1.5rem', minHeight: '100vh', backgroundColor: '#0d1117' }}>
                {/* Left Nav Skeleton */}
                <nav style={{ width: '200px', flexShrink: 0 }}>
                    <div className='skeleton-text' style={{ width: '60px', height: '16px', marginBottom: '16px' }} />
                    {[1, 2, 3].map(i => (
                        <div key={i} className='skeleton-text' style={{ height: '40px', marginBottom: '8px' }} />
                    ))}
                    <div className='skeleton-text' style={{ height: '44px', marginTop: '24px' }} />
                </nav>

                {/* Main Content Skeleton */}
                <main style={{ flex: 1 }}>
                    <div className='skeleton-text' style={{ width: '250px', height: '28px', marginBottom: '24px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className='skeleton-text' style={{ height: '80px' }} />
                        ))}
                    </div>
                </main>
            </main>
        )
    }

    return (
        <div>

            {/* NAV */}
            <nav>
                <p>Sections</p>

                {NAV_ITEMS.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveNav(item.id)}
                    >
                        {item.label}
                    </button>
                ))}

                <button onClick={() => getResumePdf(interviewId)}>
                    Download Resume
                </button>
            </nav>

            {/* CONTENT */}
            <main>

                {activeNav === 'technical' && (
                    <section>
                        <h2>Technical Questions</h2>

                        {report.technicalQuestions.map((q, i) => (
                            <QuestionCard key={i} item={q} index={i} />
                        ))}
                    </section>
                )}

                {activeNav === 'behavioral' && (
                    <section>
                        <h2>Behavioral Questions</h2>

                        {report.behavioralQuestions.map((q, i) => (
                            <QuestionCard key={i} item={q} index={i} />
                        ))}
                    </section>
                )}

                {activeNav === 'roadmap' && (
                    <section>
                        <h2>Preparation Road Map</h2>

                        {report.preparationPlan.map(day => (
                            <RoadMapDay key={day.day} day={day} />
                        ))}
                    </section>
                )}

            </main>

            {/* SIDEBAR */}
            <aside>

                <div>
                    <p>Match Score</p>
                    <span>{report.matchScore}%</span>
                </div>

                <div>
                    <p>Skill Gaps</p>

                    {report.skillGaps.map((gap, i) => (
                        <span key={i}>
                            {gap.skill}
                        </span>
                    ))}
                </div>

            </aside>

        </div>
    )
}

export default Interview