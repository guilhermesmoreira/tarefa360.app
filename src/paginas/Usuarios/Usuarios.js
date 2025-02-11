import { Link } from "react-router-dom";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import { MdDelete, MdEdit } from "react-icons/md";
import { useEffect, useState } from "react";
import Table from "react-bootstrap/esm/Table";
import UsuarioAPI from "../../services/usuarioAPI";
import style from "./Usuarios.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";


export function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);    
    const [tiposUsuarios, setTiposUsuarios] = useState([]);

    useEffect(() => {
        const fetchTiposUsuarios = async () => {
            try {
                const tipos = await UsuarioAPI.listarTiposUsuarioAsync();
                setTiposUsuarios(tipos);
            } catch (error) {
                console.error('Erro ao buscar tipos de usuários:', error);
            }
        };

        fetchTiposUsuarios();
    }, []);


    const handleCLickDeletar = (usuario) => {
        setUsuarioSelecionado(usuario)
        setMostrarModal(true);
    }

    const handleDeletar = async () => {
        try {
            await UsuarioAPI.deletarAsync(usuarioSelecionado.id);
            setUsuarios(usuarios.filter(u => u.id !== usuarioSelecionado.id));
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
        } finally {
            handleFecharModal();
        }
    };

    const handleFecharModal = () => {
        setMostrarModal(false);
        setUsuarioSelecionado(null);
    }

    async function carregarUsuarios() {
        try {
            const listaUsuarios = await UsuarioAPI.listarAsync(true);
            setUsuarios(listaUsuarios);
            console.log(usuarios);
        } catch (error) {
            console.error("Erro ao carregar usuários:", error);
        }    
    }

    useEffect(() => {
        carregarUsuarios();
    }, []);

    return (
        <Sidebar>
            <Topbar>
                <div className={style.pagina_conteudo}>
                    <div className={style.pagina_cabecalho}>
                        <h3>Usuarios</h3>
                        <Link to='/usuario/novo' className={style.botao_novo}>+ Novo</Link>
                    </div>

                    <div className={style.tabela}>
                        <Table responsive>
                            <thead className={style.tabela_cabecalho}>
                                <tr>
                                    <th>Nome</th>
                                    <th>Email</th>
                                    <th>Função</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody className={style.tabela_corpo}>
                                {usuarios.map((usuario) => (
                                    <tr key={usuario.id}>
                                        <td>{usuario.nome}</td>
                                        <td>{usuario.email}</td>                                        
                                        <td>{tiposUsuarios.find((tipo) => tipo.id == usuario.tipoUsuarioId).nome}</td>
                                        <td>
                                            <Link to='/usuario/editar' state={usuario.id} className={style.botao_editar}>
                                                <MdEdit />
                                            </Link>
                                            <button onClick={() => handleCLickDeletar(usuario)} className={style.botao_deletar}>
                                                <MdDelete />
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </Table>
                    </div>

                    <Modal show={mostrarModal} onHide={handleFecharModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmar</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            Tem certeza que deseja deletar o usuário {usuarioSelecionado?.nome}?
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleFecharModal}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={handleDeletar}>
                                Deletar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </Topbar>
        </Sidebar>
    )
}