export type TeamMember = {
  id: string;
  fullName: string;
  designation: string;
  department: string;
  shortDescription: string;
  biography: string;
  qualifications: string;
  experience: string;
  linkedinUrl: string;
  email: string;
  phone: string;
  profilePhoto: string;
  displayOrder: number;
  featured: boolean;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

export type TeamMemberInput = Omit<TeamMember, "id" | "createdAt" | "updatedAt">;

const API = "/api";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // keep default message
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export async function fetchPublicTeam(): Promise<TeamMember[]> {
  return handle(await fetch(`${API}/management-team`));
}

export async function fetchAllTeam(token: string): Promise<TeamMember[]> {
  return handle(await fetch(`${API}/management-team?all=1`, { headers: authHeaders(token) }));
}

export async function createTeamMember(token: string, data: Partial<TeamMemberInput>): Promise<TeamMember> {
  return handle(
    await fetch(`${API}/management-team`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    }),
  );
}

export async function updateTeamMember(token: string, id: string, data: Partial<TeamMemberInput>): Promise<TeamMember> {
  return handle(
    await fetch(`${API}/management-team/${id}`, {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    }),
  );
}

export async function deleteTeamMember(token: string, id: string): Promise<void> {
  await handle(
    await fetch(`${API}/management-team/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    }),
  );
}

export async function reorderTeam(token: string, orders: { id: string; displayOrder: number }[]): Promise<TeamMember[]> {
  return handle(
    await fetch(`${API}/management-team-order`, {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(orders),
    }),
  );
}

async function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

export async function uploadTeamPhoto(token: string, file: File): Promise<string> {
  const data = await readFileAsDataUrl(file);
  const result = await handle<{ url: string }>(
    await fetch(`${API}/management-team/upload`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ filename: file.name, data }),
    }),
  );
  return result.url;
}

export async function uploadDownloadDocument(token: string, file: File): Promise<string> {
  const data = await readFileAsDataUrl(file);
  const result = await handle<{ url: string }>(
    await fetch(`${API}/downloads/upload`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ data }),
    }),
  );
  return result.url;
}
