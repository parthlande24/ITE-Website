from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from database import get_db
from models import User, Task, Team
from routers.auth import get_current_user
from routers.tasks import task_to_dict
import uuid

router = APIRouter(prefix="/api/mentor", tags=["mentor"])


class CreateMentorTaskRequest(BaseModel):
    title: str
    description: Optional[str] = None
    dueDate: Optional[str] = None
    stage: Optional[int] = None
    teamId: Optional[str] = None
    scope: Optional[str] = None  # "all-my-teams" | "single-team"


@router.post("/tasks")
def create_mentor_task(
    body: CreateMentorTaskRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "mentor":
        raise HTTPException(status_code=403, detail="Mentors only")

    if body.scope == "all-my-teams":
        teams = db.query(Team).filter(Team.mentor_id == current_user.id).all()
        if not teams:
            raise HTTPException(status_code=400, detail="You do not mentor any teams")
        
        created_tasks = []
        for team in teams:
            t = Task(
                id=str(uuid.uuid4()),
                title=body.title,
                description=body.description,
                due_date=body.dueDate,
                stage=body.stage,
                created_by_id=current_user.id,
                team_id=team.id,
            )
            db.add(t)
            created_tasks.append(t)
        db.commit()
        return [task_to_dict(t) for t in created_tasks]

    else:
        if not body.teamId:
            raise HTTPException(status_code=400, detail="teamId is required when scope is not 'all-my-teams'")
        
        # Verify team exists and is mentored by this mentor
        team = db.query(Team).filter(Team.id == body.teamId).first()
        if not team:
            raise HTTPException(status_code=404, detail="Team not found")
        if team.mentor_id != current_user.id:
            raise HTTPException(status_code=403, detail="You do not mentor this team")

        t = Task(
            id=str(uuid.uuid4()),
            title=body.title,
            description=body.description,
            due_date=body.dueDate,
            stage=body.stage,
            created_by_id=current_user.id,
            team_id=team.id,
        )
        db.add(t)
        db.commit()
        return task_to_dict(t)
