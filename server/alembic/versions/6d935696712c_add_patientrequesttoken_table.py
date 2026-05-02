"""Add PatientRequestToken table

Revision ID: 6d935696712c
Revises: 27b8726914b4
Create Date: 2026-05-02 13:21:42.642246

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6d935696712c'
down_revision: Union[str, Sequence[str], None] = '27b8726914b4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
