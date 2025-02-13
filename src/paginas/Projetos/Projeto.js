import { Sidebar } from '../../componentes/Sidebar/Sidebar';
import { Topbar } from '../../componentes/Topbar/Topbar';
import { Link } from 'react-router-dom';
import { MdDelete, MdEdit, MdSave } from 'react-icons/md'; // Adicionei MdSave para o ícone de salvar
import { useState, useEffect } from 'react';
import style from './Projeto.module.css';
import Table from 'react-bootstrap/esm/Table';
import ProjetoApi from '../../services/projetoAPI';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'; // Importei o Form para os campos de input

export function Projetos() {
    const [projetos, setProjetos] = useState([]);
    const [mostrarModalDeletar, setMostrarModalDeletar] = useState(false);
    const [mostrarModalNovo, setMostrarModalNovo] = useState(false); // Estado para controlar o modal de novo projeto
    const [projetoSelecionado, setProjetoSelecionado] = useState(null);
    const [inputSelecionado, setInputSelecionado] = useState({ input: '' });
    const [novoProjeto, setNovoProjeto] = useState({ nome: '', descricao: '' }); // Estado para os campos do novo projeto

    const handleClickDeletar = (projeto) => {
        setProjetoSelecionado(projeto);
        setMostrarModalDeletar(true);
    };

    const handleDeletar = async () => {
        try {
            await ProjetoApi.deletarAsync(projetoSelecionado.id);
            setProjetos(projetos.filter(p => p.id !== projetoSelecionado.id));
        } catch (error) {
            console.error("Erro ao deletar projeto", error);
        } finally {
            handleFecharModalDeletar();
        }
    };

    const handleFecharModalDeletar = () => {
        setMostrarModalDeletar(false);
        setProjetoSelecionado(null);
    };

    const handleFecharModalNovo = () => {
        setMostrarModalNovo(false);
        setNovoProjeto({ nome: '', descricao: '' }); // Limpa os campos ao fechar o modal
    };

    const handleChange = (e) => {
        setInputSelecionado({ ...inputSelecionado, [e.target.name]: e.target.value });
    };

    const handleChangeNovoProjeto = (e) => {
        setNovoProjeto({ ...novoProjeto, [e.target.name]: e.target.value });
    };

    const handleClear = () => {
        setInputSelecionado({ input: '' });
    };

    const handleSalvarNovoProjeto = async () => {
        try {
            const projetoSalvo = await ProjetoApi.criarAsync(novoProjeto);
            setProjetos([...projetos, projetoSalvo]); // Adiciona o novo projeto à lista
            handleFecharModalNovo(); // Fecha o modal após salvar
        } catch (error) {
            console.error("Erro ao salvar projeto", error);
        }
    };

    async function carregarProjetos() {
        try {
            const listaProjetos = await ProjetoApi.listarAsync(true);
            setProjetos(listaProjetos);
        } catch (error) {
            console.error("Erro ao carregar projetos: ", error);
        }
    }

    useEffect(() => {
        carregarProjetos();
    }, []);

    return (
        <Sidebar>
            <Topbar>
                <div className={style.pagina_conteudo}>
                    <div className={style.pagina_cabecalho}>
                        <h3>Projetos</h3>
                        <button onClick={() => setMostrarModalNovo(true)} className={style.botao_novo}>
                            + Novo
                        </button>
                    </div>
                    <div className={style.input}>
                        <input
                            placeholder="Filtrar..."
                            type="text"
                            name="input"
                            value={inputSelecionado.input}
                            onChange={handleChange}
                        />
                        <button className={style.button} onClick={handleClear}>X</button>
                    </div>

                    <div className={style.tabela}>
                        <Table responsive>
                            <thead className={style.tabela_cabecalho}>
                                <tr>
                                    <th>Nome</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>

                            <tbody className={style.tabela_corpo}>
                                {projetos.map(projeto => (
                                    <tr key={projeto.id}>
                                        <td>{projeto.nome}</td>
                                        <td>
                                            <Link to="/projeto/editar" state={projeto.id} className={style.botao_editar}>
                                                <MdEdit />
                                            </Link>
                                            <button onClick={() => handleClickDeletar(projeto)} className={style.botao_deletar}>
                                                <MdDelete />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    {/* Modal para deletar */}
                    <Modal show={mostrarModalDeletar} onHide={handleFecharModalDeletar}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmar</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Tem certeza que deseja deletar o projeto {projetoSelecionado?.nome}?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant='secondary' onClick={handleFecharModalDeletar}>
                                Cancelar
                            </Button>
                            <Button variant='danger' onClick={handleDeletar}>
                                Deletar
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Modal para adicionar novo projeto */}
                    <Modal show={mostrarModalNovo} onHide={handleFecharModalNovo}>
                        <Modal.Header closeButton>
                            <Modal.Title>Novo Projeto</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nome do Projeto</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Digite o nome do projeto"
                                        name="nome"
                                        value={novoProjeto.nome}
                                        onChange={handleChangeNovoProjeto}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Descrição</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Digite a descrição do projeto"
                                        name="descricao"
                                        value={novoProjeto.descricao}
                                        onChange={handleChangeNovoProjeto}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleFecharModalNovo}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={handleSalvarNovoProjeto}>
                                <MdSave /> Salvar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </Topbar>
        </Sidebar>
    );
}