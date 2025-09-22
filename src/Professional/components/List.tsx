import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  IconButton,
  Collapse,
  Divider,
  TextField,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import pacientesData from "../data/ListaEspera.json";
import type { Chamada } from "../../types/Chamada.tsx";

interface Paciente {
  nome: string;
  tipo_atendimento: string;
  status: "Aguardando" | "Atendido";
  prioridade: "Normal" | "Prioritário" | "Retorno";
}

const getPriorityColor = (prioridade: Paciente["prioridade"]) => {
  switch (prioridade) {
    case "Prioritário":
      return "error.main";
    case "Retorno":
      return "warning.main";
    default:
      return "success.main";
  }
};

export default function List() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [isAguardandoVisible, setIsAguardandoVisible] = useState(true);
  const [isAtendidosVisible, setIsAtendidosVisible] = useState(true);
  const [sala, setSala] = useState("");

  useEffect(() => {
    const initialPacientes = pacientesData.pacientes.map((p) => ({
      ...p,
      status: "Aguardando",
    })) as Paciente[];
    setPacientes(initialPacientes);
  }, []);

  const aguardandoList = useMemo(
    () => pacientes.filter((p) => p.status === "Aguardando"),
    [pacientes]
  );
  const atendidosList = useMemo(
    () => pacientes.filter((p) => p.status === "Atendido"),
    [pacientes]
  );

  const handleProximo = () => {
    if (aguardandoList.length === 0) return;
    const proximoPaciente = aguardandoList[0];
    handleChamarIndividual(proximoPaciente);
  };

  const handleChamarIndividual = (paciente: Paciente) => {
    if (!sala) {
      alert("Por favor, informe a sala antes de chamar.");
      return;
    }

    const novaChamada: Chamada = {
      nome: paciente.nome,
      sala: sala,
      timestamp: Date.now(),
    };

    const chamadasAnteriores: Chamada[] = JSON.parse(
      localStorage.getItem("chamadas") || "[]"
    );

    const novasChamadas = [novaChamada, ...chamadasAnteriores];

    localStorage.setItem("chamadas", JSON.stringify(novasChamadas));

    const updatedPacientes = pacientes.map((p) =>
      p.nome === paciente.nome ? { ...p, status: "Atendido" as "Atendido" } : p
    );
    setPacientes(updatedPacientes);
  };

  const handleVoltar = (paciente: Paciente) => {
    const updatedPacientes = pacientes.map((p) =>
      p.nome === paciente.nome
        ? { ...p, status: "Aguardando" as "Aguardando" }
        : p
    );
    setPacientes(updatedPacientes);

    const chamadasAnteriores: Chamada[] = JSON.parse(
      localStorage.getItem("chamadas") || "[]"
    );
    const novasChamadas = chamadasAnteriores.filter(
      (chamada) => chamada.nome !== paciente.nome
    );
    localStorage.setItem("chamadas", JSON.stringify(novasChamadas));
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 2,
        }}
      >
        <TextField
          label="Sala"
          variant="outlined"
          size="small"
          value={sala}
          onChange={(e) => setSala(e.target.value)}
          sx={{ mr: 2, width: "200px" }}
        />
        <Button
          variant="contained"
          onClick={handleProximo}
          disabled={aguardandoList.length === 0}
        >
          Chamar Próximo Paciente
        </Button>
      </Box>

      <Paper elevation={2} sx={{ mb: 4 }}>
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => setIsAguardandoVisible(!isAguardandoVisible)}
        >
          <Typography variant="h6" component="h2" fontWeight="bold">
            Fila de Espera ({aguardandoList.length})
          </Typography>
          <IconButton>
            {isAguardandoVisible ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        </Box>
        <Collapse in={isAguardandoVisible}>
          <Divider />
          <Stack spacing={1.5} sx={{ p: 2 }}>
            {aguardandoList.map((paciente) => (
              <Paper
                key={paciente.nome}
                variant="outlined"
                sx={{ display: "flex", alignItems: "stretch" }}
              >
                <Box
                  sx={{
                    width: "8px",
                    bgcolor: getPriorityColor(paciente.prioridade),
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    p: 1.5,
                    gap: 2,
                  }}
                >
                  <Box sx={{ flex: 2 }}>
                    <Typography fontWeight="bold">{paciente.nome}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {paciente.status}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 2 }}>
                    <Typography color="text.secondary">
                      {paciente.tipo_atendimento}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleChamarIndividual(paciente)}
                    >
                      Chamar
                    </Button>
                  </Box>
                </Box>
              </Paper>
            ))}
            {aguardandoList.length === 0 && (
              <Typography sx={{ p: 2, color: "text.secondary" }}>
                Nenhum paciente aguardando.
              </Typography>
            )}
          </Stack>
        </Collapse>
      </Paper>

      <Paper elevation={2}>
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => setIsAtendidosVisible(!isAtendidosVisible)}
        >
          <Typography variant="h6" component="h2" fontWeight="bold">
            Pacientes Chamados ({atendidosList.length})
          </Typography>
          <IconButton>
            {isAtendidosVisible ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        </Box>
        <Collapse in={isAtendidosVisible}>
          <Divider />
          <Stack spacing={1.5} sx={{ p: 2 }}>
            {atendidosList.map((paciente) => (
              <Paper
                key={paciente.nome}
                variant="outlined"
                sx={{ display: "flex", alignItems: "stretch" }}
              >
                <Box sx={{ width: "8px", bgcolor: "grey.400" }} />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    p: 1.5,
                    gap: 2,
                    opacity: 0.7,
                  }}
                >
                  <Box sx={{ flex: 3 }}>
                    <Typography fontWeight="bold">{paciente.nome}</Typography>
                  </Box>
                  <Box sx={{ flex: 2 }}>
                    <Typography color="text.secondary">
                      {paciente.tipo_atendimento}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleVoltar(paciente)}
                    >
                      Voltar
                    </Button>
                  </Box>
                </Box>
              </Paper>
            ))}
            {atendidosList.length === 0 && (
              <Typography sx={{ p: 2, color: "text.secondary" }}>
                Nenhum paciente foi chamado ainda.
              </Typography>
            )}
          </Stack>
        </Collapse>
      </Paper>
    </Box>
  );
}
