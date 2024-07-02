import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Projects.module.css';
import Container from '../layout/Container';
import LinkButton from '../layout/LinkButton';
import ProjectCard from '../Projects/ProjectCard'; // Verifique o caminho correto do import
import Messagem from '../layout/Messagem';
import Loading from '../layout/Loading';


function Projects() {
    const [projects, setProjects] = useState([]);
    const [removeLoading, setRemoveLoading] = useState(false);
    const[projecMessage, setProjectMessage] = useState('')

    const location = useLocation();
    let message = '';
    if (location.state) {
        message = location.state.message;
    }

    useEffect(() => {
        setTimeout(() => {
            fetch('http://localhost:5000/projects')
                .then((resp) => resp.json())
                .then((data) => {
                    console.log(data);
                    setProjects(data);
                    setRemoveLoading(true);
                })
                .catch((err) => console.log(err));
        }, 3000);
    }, []);

    function removeProject(id) {
        fetch(`http://localhost:5000/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(resp => resp.json())
            .then(data => {
                setProjects(projects.filter((project) => project.id !== id));
                setProjectMessage ('Projeto removido com sucesso!')
            })
            .catch(err => console.log(err));
    }

    return (
        <div className={styles.project_container}>
            <div className={styles.tittle_container}>
                <h1>Meus projetos</h1>
                <LinkButton to="/newproject" text="Novo Projeto"/>
            </div>
            {message && <Messagem type="success" msg={message} />}
            {projecMessage && <Messagem type="success" msg={projecMessage} />}
            <Container customClass="start">
                {projects.length > 0 &&
                    projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            id={project.id}
                            name={project.name}
                            budget={project.budget}
                            category={project.category ? project.category.name : 'N/A'}
                            handleRemove={removeProject}
                        />
                    ))}
                {!removeLoading && <Loading />}
                {removeLoading && projects.length === 0 && (
                    <p>Não há projetos cadastrados!</p>
                )}
            </Container>
        </div>
    );
}

export default Projects;
